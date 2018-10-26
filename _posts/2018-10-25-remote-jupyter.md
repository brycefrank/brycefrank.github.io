---
layout: post
title: Setting up a Remote Jupyter Connection
author: Bryce Frank
---

It will be convenient for us to set up a remote-capable IDE for writing our processing scripts. Many options are available for this, but pyfor has been developed with Jupyter notebooks in mind, and they provide a fairly simple (and free) way to do remote development. This post explains briefly how to set this environment. This is largely borrowed from [this post](https://amber-md.github.io/pytraj/latest/tutorials/remote_jupyter_notebook) but is included below for completeness.

## Installing Jupyter and Setting up Forwarding

By default, Jupyter is not included in the `pyfor_env` conda environment. We will install it ourselves on the host machine with the following command. Particularly, I recommend installing Jupyter lab.

```{bash}
conda install jupyterlab
```

Now, we start a remote server (basically a jupyter instance without opening the browser). `tmux` is useful for handling the running window.

```{bash}
jupyter lab --no-browser --port=8889
```

On your local computer open a terminal or some application that can handle `ssh` connections for you and use the following to set up ssh forwarding.

```{bash}
ssh -i your_pem.pem -N -f -L localhost:8888:localhost:8889 ubuntu@<your ipv4>
```

Now, return to your remote connection terminal and find the link that Jupyter spits out, it should look something like

```
http://localhost:8889/?token=<your token>
```

Copy that link, paste it into a brower and replace the last 9 with an 8 to match the ssh forwarding port. This should open up a window with a Jupyter lab instance. If it requests a token, copy and paste the `<your token>` part of the URL above into the text box.
