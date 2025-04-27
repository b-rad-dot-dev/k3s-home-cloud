# Deleting Images
Delete from the UI, but then run this command within the registry pod/container:

```shell
registry garbage-collect /etc/distribution/config.yml
```