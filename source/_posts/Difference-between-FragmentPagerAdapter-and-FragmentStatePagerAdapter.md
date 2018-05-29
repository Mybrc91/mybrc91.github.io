---
title: FragmentPagerAdapter和FragmentStatePagerAdapter的差别
date: 2018-05-18 22:15:00
tags:
 - Android
categories:
 - Android
---

在ViewPager中使用Fragment的时候，我们经常会遇到`FragmentPagerAdapter`和`FragmentStatePagerAdapter`。那他们的具体有什么差别呢？在一次面试中遇到这个问题后，特此深入了解了一下，写下这篇文章。

在官方文档中，关于`FragmentPagerAdapter`的描述。
>This version of the pager is best for use when there are a handful of typically more static fragments to be paged through, such as a set of tabs. The fragment of each page the user visits will be kept in memory, though its view hierarchy may be destroyed when not visible. This can result in using a significant amount of memory since fragment instances can hold on to an arbitrary amount of state. For larger sets of pages, consider FragmentStatePagerAdapter.

关于`FragmentStatePagerAdapter`的描述。
>This version of the pager is more useful when there are a large number of pages, working more like a list view. When pages are not visible to the user, their entire fragment may be destroyed, only keeping the saved state of that fragment. This allows the pager to hold on to much less memory associated with each visited page as compared to FragmentPagerAdapter at the cost of potentially more overhead when switching between pages.

其实在文档中已经写的很清楚了。当用在个数固定的Fragment时，用FragmentPagerAdapter比较好。当用在大量Fragment的时候，用FragmentStatePagerAdapter比较好。

使用`FragmentPagerAdapter`会把所有的fragment都保持在内存中，当fragment被销毁时，不会保留任何状态。所以切换到可见状态时，要重新初始化整个fragment，会消耗更多的内存。用在个数较少的固定数量fragment的情况下。

使用`FragmentStatePagerAdapter`时，当fragment不可见时，有可能被销毁，但是会保存销毁之前的状态，以便于在可见时恢复。所以在切换到可见状态时，内存消耗会更少。用在大量fragment的时候，性能会更好。

## 总结

1. `FragmentPagerAdapter` 当fragment数量固定，切数量较少时使用。比如主页tab。
2. `FragmentStatePagerAdapter` 当有大量不固定数量的fragment时使用。比如无限翻页类型的阅读页面，数量很多的分类内容页面。