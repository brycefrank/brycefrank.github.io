---
layout: post
title: Troubleshooting
author: Bryce Frank
---

Here is an archive of a few problems I have run into using AWS.

## pyopengl error when creating the pyfor environment

I ran into this issue on 10/25/2018 when attempting to install the pyfor environment from the `environment.yml` file. The error goes something like this:

```{python}
ERROR conda.core.link:_execute(502): An error occurred while installing package 'conda-forge::pyopengl-3.1.1a1-py_1'.
LinkError: post-link script failed for package conda-forge::pyopengl-3.1.1a1-py_1
running your command again with `-v` will provide additional information
location of failed script: /home/ubuntu/miniconda3/envs/pyfor_env/bin/.pyopengl-post-link.sh
==> script messages <==
<None>

Attempting to roll back.

Rolling back transaction: done

LinkError: post-link script failed for package conda-forge::pyopengl-3.1.1a1-py_1
running your command again with `-v` will provide additional information
location of failed script: /home/ubuntu/miniconda3/envs/pyfor_env/bin/.pyopengl-post-link.sh
```

This failure is the result of a missing graphics library that is used in the 3D visualization of pointclouds, we can get this by installing `xorg`

```{bash}
sudo apt-get install xorg
```
