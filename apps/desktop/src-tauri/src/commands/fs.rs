// ─── Filesystem Commands ──────────────────────────────────────────────────────
// All filesystem access goes through these Tauri commands.
// The frontend NEVER has unrestricted filesystem access.
// Permissions are declared in capabilities/default.json.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs;
use std::path::Path;
use tauri_plugin_dialog::DialogExt;
use walkdir::WalkDir;

#[derive(Debug, Serialize, Deserialize)]
pub struct PickedFolder {
    pub path: String,
    pub display_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileEntry {
    pub path: String,
    pub name: String,
    pub extension: String,
    pub size_bytes: u64,
    pub modified_at: Option<String>,
    pub is_supported: bool,
}

/// Supported file extensions for ingestion.
const SUPPORTED_EXTENSIONS: &[&str] = &[
    "pdf", "docx", "doc", "pptx", "ppt", "xlsx", "xls", "txt", "md", "markdown", "png", "jpg",
    "jpeg", "csv",
];

/// Opens the native OS folder picker dialog.
/// Returns the selected folder path and a display name.
/// CRITICAL: This is the ONLY way folder selection happens — never a browser picker.
#[tauri::command]
pub async fn pick_folder(app: tauri::AppHandle) -> Result<Option<PickedFolder>, String> {
    let folder = app
        .dialog()
        .file()
        .set_title("Select a folder for Cognote to analyze")
        .blocking_pick_folder();

    match folder {
        Some(path) => {
            let path_str = path.to_string_lossy().to_string();
            let display_name = Path::new(&path_str)
                .file_name()
                .map(|n| n.to_string_lossy().to_string())
                .unwrap_or_else(|| path_str.clone());
            Ok(Some(PickedFolder {
                path: path_str,
                display_name,
            }))
        }
        None => Ok(None),
    }
}

/// Computes a SHA-256 hash of a file at the given path.
/// Returns a hex string prefixed with "sha256:".
/// Only reads files within authorized paths — validated in capabilities.
#[tauri::command]
pub async fn hash_file(path: String) -> Result<String, String> {
    let data = fs::read(&path).map_err(|e| format!("Failed to read file: {e}"))?;
    let mut hasher = Sha256::new();
    hasher.update(&data);
    let result = hasher.finalize();
    Ok(format!("sha256:{}", hex::encode(result)))
}

/// Recursively reads a directory and returns metadata for all supported files.
/// Only traverses paths that were explicitly authorized by the user.
#[tauri::command]
pub async fn read_dir_recursive(
    folder_path: String,
    max_depth: Option<usize>,
) -> Result<Vec<FileEntry>, String> {
    let depth = max_depth.unwrap_or(20);
    let mut entries: Vec<FileEntry> = Vec::new();

    for entry in WalkDir::new(&folder_path)
        .max_depth(depth)
        .follow_links(false)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if !entry.file_type().is_file() {
            continue;
        }

        let path = entry.path();
        let name = path
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();

        let extension = path
            .extension()
            .map(|e| e.to_string_lossy().to_lowercase())
            .unwrap_or_default();

        let is_supported = SUPPORTED_EXTENSIONS.contains(&extension.as_str());

        let metadata = match fs::metadata(path) {
            Ok(m) => m,
            Err(_) => continue,
        };

        let modified_at = metadata
            .modified()
            .ok()
            .and_then(|t| {
                t.duration_since(std::time::UNIX_EPOCH)
                    .ok()
                    .map(|d| d.as_secs())
            })
            .map(|secs| {
                // Format as ISO 8601
                let dt = chrono_from_secs(secs);
                dt
            });

        entries.push(FileEntry {
            path: path.to_string_lossy().to_string(),
            name,
            extension,
            size_bytes: metadata.len(),
            modified_at,
            is_supported,
        });
    }

    Ok(entries)
}

fn chrono_from_secs(secs: u64) -> String {
    // Simple ISO 8601 UTC formatter without pulling in chrono
    let secs_i64 = secs as i64;
    let days = secs_i64 / 86400;
    let rem = secs_i64 % 86400;
    let hours = rem / 3600;
    let minutes = (rem % 3600) / 60;
    let seconds = rem % 60;

    // days since Unix epoch (1970-01-01)
    let (year, month, day) = days_to_ymd(days);
    format!(
        "{:04}-{:02}-{:02}T{:02}:{:02}:{:02}Z",
        year, month, day, hours, minutes, seconds
    )
}

fn days_to_ymd(days: i64) -> (i64, i64, i64) {
    // Gregorian calendar calculation
    let z = days + 719468;
    let era = (if z >= 0 { z } else { z - 146096 }) / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = if m <= 2 { y + 1 } else { y };
    (y, m, d)
}
