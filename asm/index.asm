section .data
	format db "Result: % d", 0x0a, 0
section .text
	global main
	extern printf
main:
	mov rax, 5
	push rax
	mov rax, 5
	push rax
	mov rax, 3
	push rax
	mov rax, 2
	pop rbx
	imul rax, rbx
	pop rbx
	cqo
	div rbx
	push rax
	mov rax, 1
	pop rbx
	add rax, rbx
	pop rbx
	sub rax, rbx



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