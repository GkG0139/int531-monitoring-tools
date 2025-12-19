#!/usr/bin/env python3
"""
Fix all 'No data' panels in Grafana dashboard
"""

import json
import re

dashboard_file = 'grafana/dashboards/four-golden-signals.json'

with open(dashboard_file, 'r') as f:
    dashboard = json.load(f)

fixes_applied = []

for panel in dashboard['panels']:
    if 'targets' not in panel:
        continue
    
    panel_id = panel.get('id')
    panel_title = panel.get('title', '')
    
    for target in panel['targets']:
        if 'expr' not in target:
            continue
        
        original_expr = target['expr']
        fixed = False
        
        # Fix Disk Usage query (panel ID 32)
        if panel_id == 32 or 'Disk Usage' in panel_title:
            old_query = '(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100'
            new_query = '(sum(node_filesystem_size_bytes{fstype!~"tmpfs|overlay|devtmpfs"}) - sum(node_filesystem_free_bytes{fstype!~"tmpfs|overlay|devtmpfs"})) / sum(node_filesystem_size_bytes{fstype!~"tmpfs|overlay|devtmpfs"}) * 100'
            
            if old_query in target['expr']:
                target['expr'] = new_query
                target['legendFormat'] = 'Disk Usage'
                fixes_applied.append(f"Panel {panel_id} ({panel_title}): Fixed Disk Usage query")
                fixed = True
        
        # Fix Error Rate query - ensure it handles no 5xx errors
        if 'Error Rate' in panel_title and '5..' in target['expr']:
            # Ensure the query properly handles zero errors
            if 'or vector(0)' not in target['expr']:
                # Add or vector(0) to handle cases with no 5xx errors
                target['expr'] = target['expr'].replace(
                    'sum(rate(ktor_http_server_requests_seconds_count{status=~"5.."}[5m]))',
                    '(sum(rate(ktor_http_server_requests_seconds_count{status=~"5.."}[5m])) or vector(0))'
                )
                fixes_applied.append(f"Panel {panel_id} ({panel_title}): Added vector(0) fallback for error rate")
                fixed = True
        
        # Fix any query with node_filesystem_avail_bytes using mountpoint="/"
        if 'node_filesystem_avail_bytes{mountpoint="/"}'in target['expr']:
            target['expr'] = target['expr'].replace(
                'node_filesystem_avail_bytes{mountpoint="/"}',
                'node_filesystem_avail_bytes'
            ).replace(
                'node_filesystem_size_bytes{mountpoint="/"}',
                'node_filesystem_size_bytes'
            )
            fixes_applied.append(f"Panel {panel_id} ({panel_title}): Removed mountpoint filter")
            fixed = True
        
        if fixed and original_expr != target['expr']:
            print(f"✓ Fixed: {panel_title} (ID: {panel_id})")
            print(f"  OLD: {original_expr[:80]}...")
            print(f"  NEW: {target['expr'][:80]}...")
            print()

# Save fixed dashboard
with open(dashboard_file, 'w') as f:
    json.dump(dashboard, f, indent=2)

print(f"\n{'='*60}")
print(f"✅ Dashboard fixes completed!")
print(f"{'='*60}")
print(f"Total fixes applied: {len(fixes_applied)}")
for fix in fixes_applied:
    print(f"  - {fix}")
