// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


use tauri::Window;

#[tauri::command]
fn set_window_always_on_top(window: Window, always_on_top: bool) {
    window.set_always_on_top(always_on_top);
}

#[tauri::command]
fn handle_custom_event(window: tauri::Window) {
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, set_window_always_on_top,handle_custom_event])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}     




