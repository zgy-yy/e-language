section .data
	format db "Result: % d", 0x0a, 0
section .text
	global main
	extern printf
main:
	mov rax, 4
	push rax
	mov rax, 3
	pop rbx
	cqo
	div rbx



;调用 printf
	lea rdi, [rel format]
	mov rsi, rax
	xor eax, eax
	call printf wrt ..plt

;退出程序
	mov eax, 60
	xor edi, edi
	syscall
section .note.GNU-stack noalloc noexec nowrite progbits