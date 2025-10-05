// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;
use serde::Deserialize;
use std::path::PathBuf;

const ABOUT_TEXT: &str = "Author: Michael Pfister\n\nCopyright\nAll game content and materials are copyright of Cloud Imperium Rights LLC and Cloud Imperium Rights Ltd.. Star Citizen®, Squadron 42®, Roberts Space Industries®, and Cloud Imperium® are registered trademarks of Cloud Imperium Rights LLC. All rights reserved. Other content is available under Creative Commons Attribution-ShareAlike unless otherwise noted.";

#[derive(Deserialize)]
struct Settings {
    #[serde(rename = "installationDirectory")]
    installation_directory: String,
}

/// Displays the about dialog with application information and copyright notice.
///
/// # Arguments
/// * `app` - The Tauri application handle
fn show_about_dialog(app: &tauri::AppHandle) {
    tauri_plugin_dialog::MessageDialogBuilder::new(
        app.clone().dialog().clone(),
        "About",
        ABOUT_TEXT,
    )
    .show(|_| {});
}

/// Displays an error dialog with a custom message.
///
/// # Arguments
/// * `app` - The Tauri application handle
/// * `message` - The error message to display
fn show_error_dialog(app: &tauri::AppHandle, message: &str) {
    tauri_plugin_dialog::MessageDialogBuilder::new(
        app.clone().dialog().clone(),
        "Error",
        message,
    )
    .show(|_| {});
}

/// Opens the GitHub repository in the default web browser.
///
/// # Arguments
/// * `app` - The Tauri application handle
fn open_github_repository(app: &tauri::AppHandle) {
    use tauri_plugin_shell::ShellExt;
    let shell = app.shell();
    let _ = shell.open("https://github.com/pfitzer/BackersLittlleHelper", None);
}

/// Launches the Star Citizen game launcher.
///
/// Reads the installation directory from the application settings file and
/// launches the Star Citizen launcher executable. Shows an error dialog if:
/// - The settings file cannot be read
/// - The installation directory is not configured
/// - The launcher executable is not found at the expected path
///
/// # Arguments
/// * `app` - The Tauri application handle
fn launch_star_citizen(app: &tauri::AppHandle) {
    use tauri_plugin_shell::ShellExt;
    let shell = app.shell();

    // Read settings file
    let app_data_dir = match app.path().app_data_dir() {
        Ok(dir) => dir,
        Err(_) => {
            show_error_dialog(app, "Failed to access application data directory.");
            return;
        }
    };

    let settings_path = app_data_dir.join("settings.json");

    let contents = match std::fs::read_to_string(&settings_path) {
        Ok(contents) => contents,
        Err(_) => {
            show_error_dialog(app, "Please configure the installation directory in Settings first.");
            return;
        }
    };

    let settings = match serde_json::from_str::<Settings>(&contents) {
        Ok(settings) => settings,
        Err(_) => {
            show_error_dialog(app, "Please configure the installation directory in Settings first.");
            return;
        }
    };

    let launcher_path = PathBuf::from(&settings.installation_directory)
        .join("StarCitizen")
        .join("LIVE")
        .join("StarCitizen_Launcher.exe");

    if launcher_path.exists() {
        let _ = shell.command(launcher_path.to_string_lossy().to_string()).spawn();
    } else {
        show_error_dialog(
            app,
            &format!("Star Citizen launcher not found at:\n{}", launcher_path.display())
        );
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .setup(|app| {
            let menu = Menu::new(app)?;

            // File menu
            let file_menu = Submenu::with_items(
                app,
                "File",
                true,
                &[
                    #[cfg(not(target_os = "macos"))]
                    &PredefinedMenuItem::quit(app, None)?,
                ],
            )?;

            let rsi_menu = Submenu::with_items(
                app,
                "RSI",
                true,
                &[
                    &MenuItem::with_id(app, "launch_sc", "Launch Star Citizen", true, None::<&str>)?,
                ],
            )?;

            // Help menu
            let help_menu = Submenu::with_items(
                app,
                "Help",
                true,
                &[
                    &MenuItem::with_id(app, "github", "GitHub Repository", true, None::<&str>)?,
                    &MenuItem::with_id(app, "about", "About", true, None::<&str>)?,
                ],
            )?;

            menu.append(&file_menu)?;
            menu.append(&rsi_menu)?;
            menu.append(&help_menu)?;

            app.set_menu(menu)?;

            Ok(())
        })
        .on_menu_event(|app, event| {
            match event.id().as_ref() {
                "about" => show_about_dialog(app),
                "github" => open_github_repository(app),
                "launch_sc" => launch_star_citizen(app),
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
