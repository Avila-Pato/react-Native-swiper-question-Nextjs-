Add-Type -AssemblyName System.Drawing

$width = 120
$height = 120
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

# Background transparente
$g.Clear([System.Drawing.Color]::Transparent)

# Colores del estilo sticker
$outlineColor   = [System.Drawing.Color]::White
$noseColor      = [System.Drawing.Color]::FromArgb(255, 248, 180, 142)   # salmon/peach
$darkNavy       = [System.Drawing.Color]::FromArgb(255, 50, 40, 90)      # dark navy/purple
$arrowColor     = [System.Drawing.Color]::FromArgb(255, 50, 40, 90)

$outlinePen    = New-Object System.Drawing.Pen($outlineColor, 6)
$outlinePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$noseBrush     = New-Object System.Drawing.SolidBrush($noseColor)
$darkPen       = New-Object System.Drawing.Pen($darkNavy, 2.5)
$darkPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$arrowBrush    = New-Object System.Drawing.SolidBrush($arrowColor)

# ---- Nariz: path aproximado ----
# Centro horizontal: 60, zona: y=18..75
$nosePath = New-Object System.Drawing.Drawing2D.GraphicsPath

# Puente de la nariz (top, estrecho)
# Forma general: trapecio redondeado con dos bulbos en la parte inferior
$nosePath.AddBezier(48, 22,  44, 32,  38, 50,  34, 62)   # lado izquierdo exterior
$nosePath.AddBezier(34, 62,  30, 72,  32, 80,  40, 78)   # bulbo izquierdo base
$nosePath.AddBezier(40, 78,  46, 76,  50, 74,  55, 75)   # base izquierda -> centro
$nosePath.AddBezier(55, 75,  60, 76,  65, 76,  70, 75)   # centro -> base derecha
$nosePath.AddBezier(70, 75,  74, 74,  80, 76,  86, 78)   # base derecha -> bulbo derecho
$nosePath.AddBezier(86, 78,  92, 80,  94, 72,  90, 62)   # bulbo derecho base
$nosePath.AddBezier(90, 62,  86, 50,  80, 32,  76, 22)   # lado derecho exterior

# Cerrar la punta arriba (puente)
$nosePath.AddBezier(76, 22,  70, 16,  54, 16,  48, 22)
$nosePath.CloseFigure()

# 1) Sombra/borde blanco sticker (dibujar path con pen grueso blanco)
$g.DrawPath($outlinePen, $nosePath)

# 2) Relleno salmon
$g.FillPath($noseBrush, $nosePath)

# 3) Contorno oscuro fino
$g.DrawPath($darkPen, $nosePath)

# Fosas nasales (dos ovales pequeños)
$g.FillEllipse($noseBrush, 38, 60, 18, 12)
$g.DrawEllipse($darkPen, 38, 60, 18, 12)
$g.FillEllipse($noseBrush, 68, 60, 18, 12)
$g.DrawEllipse($darkPen, 68, 60, 18, 12)

# Sombra sutil entre fosas (línea curva interior)
$innerPen = New-Object System.Drawing.Pen($darkNavy, 1.5)
$innerPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dot
$g.DrawArc($innerPen, 52, 64, 20, 8, 0, 180)

# ---- Flechas HACIA ABAJO (exhala) ----
# Dos flechas simétricas debajo de la nariz, apuntando hacia abajo
function Draw-DownArrow {
    param($graphics, $brush, $pen, [int]$cx, [int]$topY)

    # Línea vertical
    $graphics.DrawLine($pen, $cx, $topY, $cx, ($topY + 14))

    # Punta de flecha (triángulo hacia abajo)
    $pts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(($cx - 6), ($topY + 10)),
        [System.Drawing.Point]::new(($cx + 6), ($topY + 10)),
        [System.Drawing.Point]::new($cx,        ($topY + 22))
    )
    $graphics.FillPolygon([System.Drawing.Brush]$brush, $pts)
}

$arrowPen = New-Object System.Drawing.Pen($arrowColor, 2.5)
$arrowPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$arrowPen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round

Draw-DownArrow $g $arrowBrush $arrowPen 45 82
Draw-DownArrow $g $arrowBrush $arrowPen 79 82

# ---- Cleanup ----
$g.Dispose()

$outPath = "a:\Desktop\proyectos\gameReact\assets\icons\exhala.png"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "Saved: $outPath"
