---
layout: post
title: Subsampled Random Forest Computational Performance
date : 2018-08-18
---

Digging into the machine learning literature has revealed that a slight modification of the random forests algorithm provides amenable properties for statistical inference. The original algorithm proposed by Leo Breiman in his [seminal paper](https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf) constructs each decision tree with a bootstrapped sample of size N (the size of the training set). This bootstrap sample can be difficult to deal with in theoretical contexts, and many have suggested replacing the bootsrap sample with a proper subsample of the training data to train each tree.

Unfortunately, many software packages that implement the random forests algorithm do not allow for this behavior at the tree level, leading to jerry-rigged ways of constructing forests using proper subsamples, often by constructing "single tree forests" using manually subsampled data from the training set. The following is my own attempt I used for analysis using subsampled random forests:

[insert]

After writing the above program I needed to produce many subsampled random forests to assess my classifier via simulation, and the computation time in R, of about 2 seconds per forest, simply would not suffice. So I sought other options. The following documents some comparisons between the performance of `randomForest` via R and `sklearn.ensemble.RandomForestClassifier`, a journey into computational performance assessment.

## Some Hypotheses

The R package includes calls to C scripts to produce trees as evidenced [here](https://github.com/cran/randomForest/blob/master/src/regTree.c) whereas the Python package seems to be written primarily in `numpy` 
