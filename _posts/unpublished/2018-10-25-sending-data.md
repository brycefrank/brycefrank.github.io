---
layout: post
title: Attaching Volumes and Sending Data
date : 2018-08-10
---

Many pieces of AWS rely on elastic block storage (or EBS). For our purposes, we can consider an EBS to be a movable storage device. By default, EC2 instances are created with an 8GB EBS volume, but we will likely require more than that for processing our data. In this example I create a 100GB EBS volume and attach it to our running instance.

# Creating an EBS storage volume

Creating an EBS storage volume is straightforward. First, from your AWS console, select `Volumes` underneath `Elastic Block Store`, click `Create Volume` and then fill in your desired properties. Make sure you select the proper zone so you can attach the volume to the running EC2 instance.

Verify that the EBS storage volume has been succesfully attached with the following (with output included as an example).

```{bash}
lsblk

NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
loop0         7:0    0 87.9M  1 loop /snap/core/5328
loop1         7:1    0 12.7M  1 loop /snap/amazon-ssm-agent/495
nvme0n1     259:0    0    8G  0 disk 
└─nvme0n1p1 259:1    0    8G  0 part /
nvme1n1     259:2    0  100G  0 disk 
```

Our 100GB volume is shown above as `nvme1n1`.

# Mounting the storage volume

Now that our volume is attached, we need to format, mount the volume and give privileges.

Format to the ext4 filesystem:

```{bash}
sudo mkfs -t ext4 /dev/nvme1n1
```

Create a directory to mount the volume:

```{bash}
sudo mkdir /lidar_storage
```

Mount the volume:

```{bash}
sudo mount /dev/nvme1n1 /lidar_storage/
```

Finally we need to give the user `ubuntu` access to the mounted volume/directory with the following:

```
sudo chown ubuntu <dir>
```

We can now send our data. The following command is an example using `scp`, where we first give it the `.pem` file path, then the grob of `.las` files we want to send, and finally the address of the directory we want the files copied to, in this case `/lidar_storage` on the remote EC2 instance.

```{bash}
scp -i /path/to/your/pem.pem ~/local_las_dir/*.las ubuntu@<your_ipv4>:/lidar_storage
```
