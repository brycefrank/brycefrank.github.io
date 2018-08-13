---
layout: post
title: Getting Started
author: Bryce Frank
---

Before jumping in head first, I decided it may be prudent to run a small processing job on one of the free-tier machines. I highly suggest doing this just to get a feel for the process. Also, if you are unfamiliar with using the terminal, this will be a good place to start.

## Selecting a Machine

I will not walk through every step of setting up the virtual machine, but I will expound on a few details. First, I decided to stick with an Ubuntu VM - specifically Ubuntu Server 16.04 LTS. This is the platform I am most familiar with, but others are available (Amazon Linux 1 and 2, Red Hat, SUSE, Microsoft Windows Server, and a Deep Learning AMI). 

At the time of writing, only one free tier eligible machine is available - the t2.micro. This machine contains one virtual CPU and 1 GB of memory.

![AWS Free Tier Machine]({{"/assets/free-tier.png" | absolute_url }})

## Connecting to the Instance

After clicking Launch, the instance should run and we should see our machine available in the dashboard. The next step is to connect to the instance. This procedure will be highly dependend on your operating system and your preferred means of connection. AWS provides [extensive documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html?icmpid=docs_ec2_console) for connecting to an instance.

Once connected our terminal should show the following:

![Connected]({{"/assets/connected.png" | absolute_url}})

## Installing Software

Next, we would like to install some software on our virtual machine. For selfish reasons, I will install pyfor and its pre-requisites. I imagine, given the speed of this virtual machine, that this will take a good while. In any case, I first need to install miniconda for package management using the following:

```
wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
```

This retrieves a shell script from the provided link that will begin installing Miniconda when ran:

```
chmod +x Miniconda3-latest-Linux-x86_64.sh
./Miniconda3-latest-Linux-x86_64.sh
```

Go ahead and select `yes` when prompted to prepend the bashrc file. Finally, restart bash to get access to conda:

```
bash
```

Next we just need to clone pyfor and run the installation script.

```
git clone https://github.com/brycefrank/pyfor.git
cd pyfor
conda env create -f environment.yml
```

This creates the conda environment to install pyfor. From my experience, the environment installation varies greatly with the host operating system, and tends to complete faster using Linux operating systems. My setup took roughly 8 minutes.

Next we need to install the package itself. After install I always check if I can import pyfor in a Python shell.

```
pip install .
source activate pyfor_env
python
import pyfor
```

If the import succeeds, breathe a sigh of relief we should be able to process.

## Sending Data

Before we think about sending data it may be prudent to check the amount of space we have remaining in our little instance using the following command:

```
df -h

Filesystem      Size  Used Avail Use% Mounted on
udev            488M     0  488M   0% /dev
tmpfs           100M  3.3M   96M   4% /run
/dev/xvda1      7.7G  5.3G  2.5G  69% /
tmpfs           496M     0  496M   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           496M     0  496M   0% /sys/fs/cgroup
/dev/loop0       87M   87M     0 100% /snap/core/4830
/dev/loop1       13M   13M     0 100% /snap/amazon-ssm-agent/295
tmpfs           100M     0  100M   0% /run/user/1000

```

It is no lie that pyfor's deep dependency stack is bulky - all told we have installed ~5.3 GB (for pyfor 0.2.2) of material on this machine. For larger scale instances this will not be a deal breaker, but we are now limited to 2.5 GB. Good thing we are only worried about a small data set today.

Data can be sent to your Ubuntu instance via secure copy protocol, or  `scp`. This will need to be done from your PC (or wherever your data is located). A variety of tools exist to do this for multiple operating systems. Windows users should look toward installing `WinSCP` for this purpose. I will choose to send the pyfor test data sample to the server with the following command - fill in your specific details:

```
scp -i test-machine.pem <path to your las file> ubuntu@<your instance domain>:~
```

## Processing a Small Data Set

We are now ready to process. To simulate a semi-realistic processing scenario, I will choose to normalize my tile several times in a row, just to get a sense of our processing capability. We must be wise about our RAM allocation. I run the following commands in a Python shell (with our `pyfor_env` environment activated).

```
from pyfor.cloud import Cloud

for i in range(100):
    print(i)
    pc = Cloud("test.las")
    pc.normalize(0.5)
```
