---
title: 冒泡排序和交换排序
author: lyr
tags:
 - algorithm
categories:
 - Java
---
 
冒泡算法和交换算法

## 原理介绍

从大到小排序
### 冒泡算法原理

外循环length-1次，每进行一轮外循环，数组的第length-1-i个元素就可以排好顺序。
内循环为相邻的两个数之间不断比较：从0和1到1和2比较一直到 j < length-1-i内循环结束，符合条件时交换顺序，
致使j+1的元素一直为比较中的较大的，比较到数组的最后一个元素后，下标为length-1-i的元素即为最大值。

### 交换算法原理
外循环length-1次，每进行一轮外循环，数组的第i个元素就可以排好顺序。
内循环为外循环的下标为i元素与未排好序的其他元素一次相比较，符合条件时交换顺序，致使下标为i的元素一直为比较中的较大的，
比较到数组的最后一个元素后，下标为i的元素即为最大值。


## 冒泡算法和交换算法效率比较

冒泡算法和交换算法循环的次数是一样的,循环数次公式：
例如共有k个元素，循环次数为：1+2+3+4....+(k-1)
k为偶数时循环次数：(k-2)/2*(k+1)+1
k为奇数时循环次数：k*(k-1)/2
但是交换的次数不一定一样，由元素个数和元素顺序决定。

## 实现

### 交换排序
```java
	public static void changeSort(int[] nums){
		int temp = 0;
		for(int i = 0; i < nums.length-1; i++){
			for (int j = i + 1; j < nums.length; j++){
				if(nums[i] < nums[j]){
					temp = nums[i];
					nums[i] = nums[j];
					nums[j] = temp;
				}

		}
		
	}
```
###	冒泡排序
```java	
public static void bubbleSort(int[] nums){
		int temp = 0;

		for(int i = 0; i < nums.length-1; i++){
			for(int j = 0; j < nums.length-1-i; j++){
				if(nums[j] < nums[j+1]){
					temp = nums[j];
					nums[j] = nums[j+1];
					nums[j+1] = temp;
				}
				
			}
		}
		
	}
	
```