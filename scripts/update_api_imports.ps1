# Batch replace Supabase imports with admin-cjs in all API routes
$apiRoutes = @(
    "src\app\api\courses\route.js",
    "src\app\api\courses\[id]\route.js",
    "src\app\api\chapters\route.js",
    "src\app\api\chapters\[id]\route.js",
    "src\app\api\enroll\route.js",
    "src\app\api\progress\route.js",
    "src\app\api\quizzes\route.js",
    "src\app\api\quizzes\submit\route.js",
    "src\app\api\discussions\route.js",
    "src\app\api\mux\upload\route.js",
    "src\app\api\mux\complete\route.js",
    "src\app\api\ai\generate-quiz\route.js",
    "src\app\api\webhooks\clerk\route.js"
)

foreach ($file in $apiRoutes) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $newContent = $content -replace "from '@\/lib\/supabase\/admin'", "from '@\/lib\/supabase\/admin-cjs'"
        if ($content -ne $newContent) {
            Set-Content $file $newContent -NoNewline
            Write-Host "✅ Updated: $file"
        } else {
            Write-Host "⏭️  No change needed: $file"
        }
    } else {
        Write-Host "❌ File not found: $file"
    }
}

Write-Host "`n✅ All API routes updated!"
