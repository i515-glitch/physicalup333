import io
import os
import platform
import base64
import matplotlib
# Force matplotlib to not use any X-windows backend, to run smoothly in headless environments
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# Premium color palette definitions
NAVY_DARK = '#15233b'      # Deep Premium Navy
NAVY_LIGHT = '#2b3d58'     # Slightly softer Navy for current specs
GOLD = '#b08a3e'           # Rich Gold for target specs
GOLD_LIGHT = '#ebd3a3'     # Soft gold for area filling
GRAY_TEXT = '#475569'      # Slate 600
GRAY_LIGHT = '#f8fafc'     # Slate 50
GRID_COLOR = '#e2e8f0'     # Slate 200 (Clean, modern grid line)

# Set font for Korean support based on OS and Env Variable
FONT_FAMILY = os.environ.get("CHART_FONT_FAMILY")
if not FONT_FAMILY:
    system_name = platform.system()
    if system_name == 'Darwin':
        FONT_FAMILY = 'AppleGothic'
    elif system_name == 'Windows':
        FONT_FAMILY = 'Malgun Gothic'
    else: # Linux or other servers
        FONT_FAMILY = 'NanumGothic'

plt.rcParams['font.family'] = FONT_FAMILY
plt.rcParams['axes.unicode_minus'] = False

def render_chart_to_base64():
    """
    Utility helper to convert plt figure into base64 png string with high quality
    """
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=180, bbox_inches='tight', transparent=True)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    return f"data:image/png;base64,{image_base64}"

def generate_five_elements_chart(five_elements_dict):
    """
    Generate polar/radar chart for Yin-Yang and Five Elements balance.
    five_elements_dict: {"목": int, "화": int, "토": int, "금": int, "수": int}
    """
    # Map Five Elements to premium English labels to look modern and scientific
    elem_mapping = {"목": "Wood", "화": "Fire", "토": "Earth", "금": "Metal", "수": "Water"}
    labels = [elem_mapping.get(x, x) for x in five_elements_dict.keys()]
    values = list(five_elements_dict.values())
    
    # Number of variables
    num_vars = len(labels)
    
    # Compute angle for each axis
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    
    # The plot is circular, so we need to "complete the loop"
    values += values[:1]
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(4.2, 4.2), subplot_kw=dict(polar=True))
    
    # Draw one axe per variable and add labels with premium style
    plt.xticks(angles[:-1], labels, color=NAVY_DARK, size=11, fontweight='bold')
    
    # Draw ylabels (values 1 to 4)
    ax.set_rlabel_position(0)
    plt.yticks([1, 2, 3, 4], ["1", "2", "3", "4"], color="#94a3b8", size=8.5, fontweight='500')
    plt.ylim(0, 4.5)
    
    # Plot data with thicker gold line and glowing white-gold markers
    ax.plot(angles, values, color=GOLD, linewidth=3.5, linestyle='solid', 
            marker='o', markersize=8, markerfacecolor='#ffffff', markeredgecolor=GOLD, markeredgewidth=2.5, zorder=4)
    
    # Fill area with elegant gradient gold opacity
    ax.fill(angles, values, color=GOLD, alpha=0.22)
    
    # Styling polar grids to look clean and minimalist
    ax.spines['polar'].set_visible(False) # Hide outer circle edge
    ax.grid(color=GRID_COLOR, linestyle='-', linewidth=0.9, zorder=1)
    
    # Background color adjustment
    ax.set_facecolor((1.0, 1.0, 1.0, 0.0))
    
    # Add title with premium serif/modern layout
    plt.title("5대 대사 기질 분포 (Five Elements)", color=NAVY_DARK, size=12.5, fontweight='bold', pad=18)
    
    return render_chart_to_base64()

def generate_target_comparison_chart(current_specs, target_specs):
    """
    Generate grouped bar chart comparing Current physical vs Target level specs.
    current_specs: {"신장": float, "골격근량": float, "체중": float}
    target_specs: {"신장": float, "골격근량": float, "체중": float}
    """
    categories = list(current_specs.keys())
    current_vals = list(current_specs.values())
    target_vals = list(target_specs.values())
    
    x = np.arange(len(categories))  # the label locations
    width = 0.28  # Slimmer bars for more modern feel
    
    fig, ax = plt.subplots(figsize=(6.2, 3.8))
    
    # Plot bars with premium flat design (no borders, clean shadows/contrast)
    rects1 = ax.bar(x - width/2, current_vals, width, label='현재 내 스펙', color=NAVY_DARK, zorder=3)
    rects2 = ax.bar(x + width/2, target_vals, width, label='선수 목표 스펙', color=GOLD, zorder=3)
    
    # Add text labels, titles and custom x-axis tick labels
    ax.set_ylabel('치수 (cm / kg)', color=GRAY_TEXT, fontweight='bold', fontsize=9)
    ax.set_title('현재 체격 지표 vs 선수 목표 기준 비교', color=NAVY_DARK, size=12.5, fontweight='bold', pad=18)
    ax.set_xticks(x)
    ax.set_xticklabels(categories, color=NAVY_DARK, fontweight='bold', fontsize=10.5)
    
    # Legend with premium borderless look
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#f1f5f9', framealpha=0.95, fontsize=9, loc='upper right')
    
    # Add value labels on top of the bars with clean font
    def autolabel(rects, label_color):
        for rect in rects:
            height = rect.get_height()
            if height > 0:
                ax.annotate(f'{height:.1f}',
                            xy=(rect.get_x() + rect.get_width() / 2, height),
                            xytext=(0, 5),  # 5 points vertical offset
                            textcoords="offset points",
                            ha='center', va='bottom', fontsize=9.5, color=NAVY_DARK, fontweight='bold')
            
    autolabel(rects1, NAVY_DARK)
    autolabel(rects2, GOLD)
    
    # Styling axes and removing top/right lines
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GRID_COLOR)
    ax.spines['bottom'].set_color(GRID_COLOR)
    ax.spines['left'].set_linewidth(1.0)
    ax.spines['bottom'].set_linewidth(1.0)
    
    # Make horizontal grid lines look premium
    ax.yaxis.grid(True, linestyle='-', alpha=0.5, color=GRID_COLOR, zorder=0)
    
    # Set y limit with a bit of top headroom
    if target_vals:
        ax.set_ylim(0, max(target_vals) * 1.15)
        
    plt.tight_layout()
    
    return render_chart_to_base64()

def generate_growth_history_chart(history_list):
    """
    Generate line chart showing growth history (height and weight over time) with dual premium Y-axes.
    history_list: list of dicts, e.g. [{"date": "2026-05-10", "height": 155.2, "weight": 47.1}, ...]
    """
    # Sort history by date string
    sorted_history = sorted(history_list, key=lambda x: x["date"])
    
    dates = [x["date"] for x in sorted_history]
    heights = [x["height"] for x in sorted_history]
    weights = [x["weight"] for x in sorted_history]
    
    fig, ax1 = plt.subplots(figsize=(6.2, 3.6))
    
    # Format dates for cleaner X axis display (e.g. 2026-05-10 -> 05/10)
    formatted_dates = []
    for d in dates:
        try:
            parts = d.split('-')
            if len(parts) == 3:
                formatted_dates.append(f"{parts[1]}/{parts[2]}")
            else:
                formatted_dates.append(d)
        except:
            formatted_dates.append(d)
            
    # Plot Height on ax1 (Left Y axis) - Navy Theme
    color_height = NAVY_DARK
    ax1.set_xlabel('측정일', color=GRAY_TEXT, fontweight='bold', fontsize=9, labelpad=8)
    ax1.set_ylabel('신장 (cm)', color=color_height, fontweight='bold', fontsize=9)
    
    # Thick line with solid circular white-navy marker
    line1 = ax1.plot(formatted_dates, heights, color=color_height, linewidth=3.0, linestyle='-', 
                     marker='o', markersize=7, markerfacecolor='#ffffff', markeredgecolor=color_height, 
                     markeredgewidth=2.2, label='신장 (cm)')
    ax1.tick_params(axis='y', labelcolor=color_height, labelsize=9)
    
    # Adjust y limits for height to give some padding
    if heights:
        min_h, max_h = min(heights), max(heights)
        if min_h == max_h:
            ax1.set_ylim(min_h - 4, max_h + 4)
        else:
            ax1.set_ylim(min_h - 1.5, max_h + 1.5)
            
    # Plot Weight on ax2 (Right Y axis) - Gold Theme
    ax2 = ax1.twinx()  
    color_weight = GOLD
    ax2.set_ylabel('체중 (kg)', color=color_weight, fontweight='bold', fontsize=9)
    
    # Thick line with solid square white-gold marker
    line2 = ax2.plot(formatted_dates, weights, color=color_weight, linewidth=3.0, linestyle='-', 
                     marker='s', markersize=7, markerfacecolor='#ffffff', markeredgecolor=color_weight, 
                     markeredgewidth=2.2, label='체중 (kg)')
    ax2.tick_params(axis='y', labelcolor=color_weight, labelsize=9)
    
    # Adjust y limits for weight to give some padding
    if weights:
        min_w, max_w = min(weights), max(weights)
        if min_w == max_w:
            ax2.set_ylim(min_w - 4, max_w + 4)
        else:
            ax2.set_ylim(min_w - 1.5, max_w + 1.5)
            
    # Combine legends into one premium floating box
    lines = line1 + line2
    labels = [l.get_label() for l in lines]
    ax1.legend(lines, labels, loc='upper left', frameon=True, facecolor='#ffffff', edgecolor='#f1f5f9', framealpha=0.95, fontsize=8.5)
    
    # Styling and grids
    ax1.spines['top'].set_visible(False)
    ax2.spines['top'].set_visible(False)
    ax1.spines['left'].set_color(GRID_COLOR)
    ax1.spines['bottom'].set_color(GRID_COLOR)
    ax2.spines['right'].set_color(GRID_COLOR)
    ax1.spines['left'].set_linewidth(1.0)
    ax1.spines['bottom'].set_linewidth(1.0)
    ax2.spines['right'].set_linewidth(1.0)
    
    # Grid lines on the primary y-axis only, to avoid overlapping grids
    ax1.yaxis.grid(True, linestyle='-', alpha=0.5, color=GRID_COLOR, zorder=0)
    
    plt.title('우리아이 누적 성장 추이 곡선', color=NAVY_DARK, size=12.5, fontweight='bold', pad=18)
    plt.tight_layout()
    
    return render_chart_to_base64()
