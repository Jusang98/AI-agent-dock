// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // Position window at bottom center of screen
            if let Ok(monitor) = window.current_monitor() {
                if let Some(monitor) = monitor {
                    let screen_size = monitor.size();
                    let screen_pos = monitor.position();
                    let win_size = window.outer_size().unwrap_or_default();

                    let x = screen_pos.x + (screen_size.width as i32 - win_size.width as i32) / 2;
                    let y = screen_pos.y + screen_size.height as i32 - win_size.height as i32;

                    let _ = window.set_position(tauri::Position::Physical(
                        tauri::PhysicalPosition { x, y },
                    ));
                }
            }

            // Make window ignore mouse events on transparent areas (macOS)
            let _ = window.set_ignore_cursor_events(false);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
