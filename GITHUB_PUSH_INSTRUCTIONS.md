# Инструкция по загрузке проекта в GitHub

## Шаг 1: Создайте Personal Access Token

1. Перейдите на: https://github.com/settings/tokens
2. Нажмите "Generate new token" → "Generate new token (classic)"
3. Дайте название токену (например: "Volonter-Hub-Push")
4. Выберите срок действия (например: 90 дней или "No expiration")
5. Выберите scope: **repo** (полный доступ к репозиториям)
6. Нажмите "Generate token"
7. **ВАЖНО**: Скопируйте токен сразу! Он больше не будет показан.

## Шаг 2: Выполните push

Выполните в терминале:

```powershell
git push -u origin master
```

При запросе:
- **Username**: `MakeByShake`
- **Password**: вставьте ваш Personal Access Token (НЕ пароль от GitHub!)

## Альтернативный способ: Использовать токен в URL

Если хотите использовать токен прямо в URL (менее безопасно):

```powershell
git remote set-url origin https://YOUR_TOKEN@github.com/MakeByShake/Volonter-Hub.git
git push -u origin master
```

Замените `YOUR_TOKEN` на ваш Personal Access Token.

## Проверка

После успешного push проверьте репозиторий:
https://github.com/MakeByShake/Volonter-Hub

