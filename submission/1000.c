#include <stdio.h>
#include <stdlib.h>
int main()
{
	int a, b;
	scanf("%d %d", &a, &b);
	
	int* ptr = (int*) 0x00000000;
 	*ptr = 1;
    printf("%d", a + b);
	return 0;
}