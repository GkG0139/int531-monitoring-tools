#!/usr/bin/env python3
"""
Restructure Grafana Dashboard Panels
This script reorganizes panel positions for a clean, non-overlapping layout
"""

import json
import sys

def restructure_panels(dashboard_file):
    """Restructure dashboard panels with clean positioning"""
    
    with open(dashboard_file, 'r') as f:
        dashboard = json.load(f)
    
    panels = dashboard['panels']
    y_position = 0
    
    # Define panel structure with proper positioning
    # Format: {panel_id or title_keyword: (x, y, w, h)}
    
    restructured = []
    
    for panel in panels:
        panel_id = panel.get('id')
        panel_type = panel.get('type')
        title = panel.get('title', '')
        
        # Row panels - always full width
        if panel_type == 'row':
            panel['gridPos'] = {'h': 1, 'w': 24, 'x': 0, 'y': y_position}
            restructured.append(panel)
            y_position += 1
            continue
        
        # Organize by section based on panel IDs and titles
        
        # System Saturation Section (CPU, Memory, Disk) - 3 charts side by side
        if panel_id in [30, 31, 32]:  # CPU, Memory, Disk
            if panel_id == 30:  # CPU
                panel['gridPos'] = {'h': 8, 'w': 8, 'x': 0, 'y': y_position}
            elif panel_id == 31:  # Memory
                panel['gridPos'] = {'h': 8, 'w': 8, 'x': 8, 'y': y_position}
            elif panel_id == 32:  # Disk
                panel['gridPos'] = {'h': 8, 'w': 8, 'x': 16, 'y': y_position}
            restructured.append(panel)
            if panel_id == 32:
                y_position += 8
            continue
        
        # Traffic & Errors Section - 2 charts side by side
        if panel_id in [20, 21]:
            if panel_id == 20:  # Request Rate by Status Code
                panel['gridPos'] = {'h': 8, 'w': 12, 'x': 0, 'y': y_position}
            elif panel_id == 21:  # Error Rate %
                panel['gridPos'] = {'h': 8, 'w': 12, 'x': 12, 'y': y_position}
            restructured.append(panel)
            if panel_id == 21:
                y_position += 8
            continue
        
        # Four Golden Signals Section - 4 gauges in a row
        if panel_id in [210, 201, 2, 3, 4, 202, 203]:
            gauge_positions = {
                210: {'h': 8, 'w': 6, 'x': 0, 'y': y_position},   # Latency P95
                201: {'h': 8, 'w': 6, 'x': 6, 'y': y_position},   # Traffic
                2: {'h': 8, 'w': 6, 'x': 6, 'y': y_position},     # Traffic alt
                3: {'h': 8, 'w': 6, 'x': 12, 'y': y_position},    # Errors
                4: {'h': 8, 'w': 6, 'x': 18, 'y': y_position},    # Saturation/CPU
                202: {'h': 8, 'w': 6, 'x': 12, 'y': y_position},  # Active Connections
                203: {'h': 8, 'w': 6, 'x': 18, 'y': y_position}   # Reading/Writing
            }
            if panel_id in gauge_positions:
                panel['gridPos'] = gauge_positions[panel_id]
                restructured.append(panel)
                if panel_id == 203 or panel_id == 4:
                    y_position += 8
            continue
        
        # Frontend Latency Section - 2 charts side by side
        if panel_id in [211, 212]:
            if panel_id == 211:
                panel['gridPos'] = {'h': 8, 'w': 12, 'x': 0, 'y': y_position}
            elif panel_id == 212:
                panel['gridPos'] = {'h': 8, 'w': 12, 'x': 12, 'y': y_position}
            restructured.append(panel)
            if panel_id == 212:
                y_position += 8
            continue
        
        # Frontend Traffic Section - 2 charts side by side  
        if panel_id in [206, 207]:
            if panel_id == 206:
                panel['gridPos'] = {'h': 8, 'w': 12, 'x': 0, 'y': y_position}
            elif panel_id == 207:
                panel['gridPos'] = {'h': 8, 'w': 12, 'x': 12, 'y': y_position}
            restructured.append(panel)
            if panel_id == 207:
                y_position += 8
            continue
        
        # Frontend Errors Section - 2 charts side by side
        if panel_id in [208, 209]:
            if panel_id == 208:
                panel['gridPos'] = {'h': 8, 'w': 12, 'x': 0, 'y': y_position}
            elif panel_id == 209:
                panel['gridPos'] = {'h': 8, 'w': 12, 'x': 12, 'y': y_position}
            restructured.append(panel)
            if panel_id == 209:
                y_position += 8
            continue
        
        # Backend Section
        if panel_id in [106, 107, 109, 110, 111, 112]:
            backend_positions = {
                106: {'h': 8, 'w': 12, 'x': 0, 'y': y_position},
                107: {'h': 8, 'w': 12, 'x': 12, 'y': y_position},
                110: {'h': 8, 'w': 12, 'x': 12, 'y': y_position + 8},
                109: {'h': 8, 'w': 12, 'x': 0, 'y': y_position + 16},
                111: {'h': 8, 'w': 12, 'x': 12, 'y': y_position + 16},
                112: {'h': 8, 'w': 12, 'x': 0, 'y': y_position + 24},
            }
            if panel_id in backend_positions:
                panel['gridPos'] = backend_positions[panel_id]
                restructured.append(panel)
                if panel_id == 112:
                    y_position += 32
            continue
        
        # Database Section - 2 charts side by side
        if panel_id in [40, 41]:
            if panel_id == 40:
                panel['gridPos'] = {'h': 8, 'w': 12, 'x': 0, 'y': y_position}
            elif panel_id == 41:
                panel['gridPos'] = {'h': 8, 'w': 12, 'x': 12, 'y': y_position}
            restructured.append(panel)
            if panel_id == 41:
                y_position += 8
            continue
        
        # Default: add panel as-is and increment y
        restructured.append(panel)
        y_position += panel.get('gridPos', {}).get('h', 8)
    
    dashboard['panels'] = restructured
    
    # Write back
    with open(dashboard_file, 'w') as f:
        json.dump(dashboard, f, indent=2)
    
    print(f"✅ Dashboard restructured successfully!")
    print(f"   Total panels: {len(restructured)}")
    print(f"   Total height: {y_position}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python restructure_dashboard.py <dashboard.json>")
        sys.exit(1)
    
    restructure_panels(sys.argv[1])
