Add-Type -AssemblyName System.Drawing

$width = 120
$height = 120
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

$outlineColor = [System.Drawing.Color]::White
$noseColor    = [System.Drawing.Color]::FromArgb(255, 248, 180, 142)
$darkNavy     = [System.Drawing.Color]::FromArgb(255, 50, 40, 90)

$outlinePen = New-Object System.Drawing.Pen($outlineColor, 6)
$outlinePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$noseBrush  = New-Object System.Drawing.SolidBrush($noseColor)
$darkPen    = New-Object System.Drawing.Pen($darkNavy, 2.5)
$darkPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$darkBrush  = New-Object System.Drawing.SolidBrush($darkNavy)
$innerPen   = New-Object System.Drawing.Pen($darkNavy, 1.5)

# ---- Nariz ----
$nosePath = New-Object System.Drawing.Drawing2D.GraphicsPath
$nosePath.AddBezier(48, 22,  44, 32,  38, 50,  34, 62)
$nosePath.AddBezier(34, 62,  30, 72,  32, 80,  40, 78)
$nosePath.AddBezier(40, 78,  46, 76,  50, 74,  55, 75)
$nosePath.AddBezier(55, 75,  60, 76,  65, 76,  70, 75)
$nosePath.AddBezier(70, 75,  74, 74,  80, 76,  86, 78)
$nosePath.AddBezier(86, 78,  92, 80,  94, 72,  90, 62)
$nosePath.AddBezier(90, 62,  86, 50,  80, 32,  76, 22)
$nosePath.AddBezier(76, 22,  70, 16,  54, 16,  48, 22)
$nosePath.CloseFigure()

$g.DrawPath($outlinePen, $nosePath)
$g.FillPath($noseBrush, $nosePath)
$g.DrawPath($darkPen, $nosePath)

# Fosas nasales
$g.FillEllipse($noseBrush, 38, 60, 18, 12)
$g.DrawEllipse($darkPen, 38, 60, 18, 12)
$g.FillEllipse($noseBrush, 68, 60, 18, 12)
$g.DrawEllipse($darkPen, 68, 60, 18, 12)

$innerPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dot
$g.DrawArc($innerPen, 52, 64, 20, 8, 0, 180)

# ---- Símbolo pausa: dos barras verticales ----
$pausePen = New-Object System.Drawing.Pen($darkNavy, 5)
$pausePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pausePen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round

$g.DrawLine($pausePen, 46, 84, 46, 100)
$g.DrawLine($pausePen, 58, 84, 58, 100)

$g.Dispose()

$outPath = "a:\Desktop\proyectos\gameReact\assets\icons\sosten.png"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Saved: $outPath"
