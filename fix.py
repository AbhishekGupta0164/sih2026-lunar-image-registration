import re

with open("docs/Project_Report.md", "r") as f:
    content = f.read()

ui_details = """
### 4.1 PairDesk Diagnostic Workbench
The primary web interface providing a high-tech, dark-mode environment for mission operators to control the image registration pipeline.

### 4.2 RegisterView Command Center
- **Configuration Hub:** Dropdowns to manually select the Step/Stage Range (0-9), Pair Instances (e.g. OHRC vs NAC), Matcher Expert Route (Auto, LoFTR, LightGlue, etc.), and Geodetic Output Model.
- **9-Stage Interactive Pipeline HUD:** An animated, multi-colored execution grid showing the real-time status of each pipeline stage. Operators can click on any stage (e.g. "Ingest", "GSD Resampling", "Gate Router") to inspect its specific KPIs.
- **Real-Time Telemetry Metrics:** Each selected stage displays four live technical KPIs (e.g., VRAM usage, Extracted Points, RMSE drop, Coverage Index).
- **Live Execution Terminal:** A built-in STDOUT/STDERR terminal console streaming backend logs as they happen, with Stream/Store toggle capabilities.

### 4.3 Results & CompareView
- **Interactive Overlay Canvas:** Provides scientists with a responsive canvas to analyze the sub-pixel alignment using three modes: Checkerboard, Wipes (Slide comparison), and direct Alpha Blending.
- **Diagnostic Overlays:** Toggleable visual layers including the Quiver Plot (motion field) to analyze affine geometric transformations.

### 4.4 Metrics Scoreboard & Export Engine
Displays the final calculation matrix (RMSE, CE90, NNI) and provides one-click bundling to export the registered GeoTIFF, Matches CSV, and automatically generated PDF reports.
"""

if "### 4.1 PairDesk Diagnostic Workbench" not in content:
    content = content.replace("### Key UI Sub-Systems:\n- **RegisterView.tsx:** The primary command center. Allows users to override the Pipeline Routing Gate, select target pairs (e.g., OHRC vs. WAC), and monitor execution via a multi-color animated 9-Stage telemetry grid and live WebSocket-style STDOUT terminal.\n- **CompareView.tsx:** An interactive canvas supporting Side-by-Side Wipes, Checkerboard overlays, and dense Quiver-Plot feature point visualizers.\n- **Styling Architecture:** Designed with modern glassmorphism (Tailwind CSS), glowing UI elements, and deep Space-Navy/Cyan color palettes matching ISRO's aesthetic standards.", ui_details)
    with open("docs/Project_Report.md", "w") as f:
        f.write(content)
