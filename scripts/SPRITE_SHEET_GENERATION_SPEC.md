# 行走图素材规范（给图像模型 / 美术的硬性要求）

用于 `images/*` 中 **角色行走图**（`Character` / `Player`）。引擎常量见 `js/game-constants.js` 的 `SPRITE_WIDTH`、`SPRITE_HEIGHT`。

## 必须满足（违反则需脚本重切或改引擎）

1. **整张图尺寸**  
   - 宽 `SPRITE_WIDTH * 3`，高 `SPRITE_HEIGHT * 4`（当前为 **32×3 = 96** 宽，**96×4 = 384** 高）。

2. **网格**  
   - **4 行 × 3 列**，每格 **32×`SPRITE_HEIGHT` 像素**，无半像素偏移。  
   - 行顺序固定：**第 1 行 = 朝上（背面）**，**第 2 行 = 朝右**，**第 3 行 = 朝下（正面）**，**第 4 行 = 朝左**。  
   - 列顺序：**左步 / 站立 / 右步**（中间列为待机）。

3. **透明背景**  
   - 导出 **PNG，RGBA**，背景 **alpha = 0**。  
   - **禁止**品红/绿幕占位又不带通道；若必须用单色底，在提示词里写死 **精确 RGB**，并说明由程序色键。

4. **脚底对齐**  
   - 每格内角色 **脚底贴在格子最底一行像素**（与地砖接缝一致）。

5. **四向一致**  
   - 同一角色 **头身比、武器持法** 在四向之间一致；**不要**把正面帧塞进“朝上”行，**不要**两行都是同一侧脸。

6. **风格**  
   - 优先 **硬边像素画**（可用 1px 描边），避免依赖后期缩放锐化。

## 英文短提示（可贴进文生图）

```
RPG walk sprite sheet exactly 96x384 pixels, sharp pixel art, RGBA transparent background,
no magenta no checkerboard, 4 rows 3 columns, cell size 32x96 pixels, no grid lines in image,
row1 back/up, row2 right profile, row3 front/down, row4 left profile,
columns walk-left idle walk-right, feet flush to bottom of each cell, same scale all rows.
```

## 项目内重建命令

- 从 AI 导出的大图切到引擎尺寸：`python scripts/build-frieren-walk.py`（按脚本内说明配置源文件与布局）。

## 左右走「闪」——常见原因与附件（给别人排查时请带上）

引擎三列是 **左步 | 待机 | 右步**，中间列必须与两侧 **同一朝向、同一头身比**。若源图里中间格画成别的朝向或武器位置跳变，拼进 `frieren-walk.png` 后走路会像抽帧。

**请尽量附上：**

1. **`images/frieren-walk-gen-source.png`**（或你当前用的 **原始大图**，未经过脚本的那张）。  
2. **脚本输出** **`images/frieren-walk.png`**（96×384）。  
3. **`js/game-constants.js`** 里当前的 `SPRITE_WIDTH` / `SPRITE_HEIGHT`（确认与图一致）。  
4. 若改过切图脚本：说明用的是 **`scripts/build-frieren-walk.py`** 里哪种布局（newgen 3 列 / legacy 5 列）。

拼合脚本已对 **同一行三格使用统一缩放 + 脚底中心对齐**，减轻因每帧包围盒不同造成的抖动；若仍闪，多半是 **源图中间帧本身与左右帧差异过大**，需要在原画中改待机帧。
