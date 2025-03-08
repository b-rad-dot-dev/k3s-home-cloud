# Prerequisites
The following assumes you created the docker image in the `prerequisites` folder and ran `start` / `start.bat` accordingly

# Create inventory file

* Put the master node under the `master` group
* Put the other nodes under the `workers` group
* Set `ansible_host` to set the IP if unable to resolve hostname
* Set `initial_user` to set the username of the user to initially login as that has administrator permissions
* Set `ansible_port` if you're using a non-standard port (e.g. WSL instance)
* Set `ansible_user_provisioned: false`

# Provisioning the ansible user
Run the following and when prompted, enter the password for the particular host
```shell
ansible-playbook -i inventory/cluster.yaml prepare.yaml
```
Then update the inventory to set `ansible_user_provisioned: true` for all hosts that had the ansible user successfully provisioned

# Creating the k3s cluster
Then run the following to setup the k3s cluster
```shell
ansible-playbook -i inventory/cluster.yaml cluster.yaml
```