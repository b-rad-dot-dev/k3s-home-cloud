# Build/Run with

Rebuild docker image (keeping mysql data)
```shell
docker compose down && docker rmi jwt-login-app:latest && docker compose up
```

Remove and rebuild everything
```shell
docker compose down && sudo rm -rf mysql-data/ && docker rmi jwt-login-app:latest && docker compose up
```