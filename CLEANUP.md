# Очистка от старых файлов

Удалите следующие папки и файлы:

```bash
# Удалить старые папки
rm -rf Chrome_extension
rm -rf NodeServer
rm -rf .DS_Store
find . -name ".DS_Store" -delete
```

Это безопасно, так как все файлы уже перенесены в packages/
