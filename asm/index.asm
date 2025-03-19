section .data
	format db "Result: % d", 0x0a, 0
section .text
	global main
	extern printf
main:
	push rbp
	mov rbp, rsp
	sub rsp, 1
	lea rax, [rbp -1]
	push rax
	mov rax, 67
	pop rdi
	mov [rdi], rax
	mov rax, 1
	push rax
	lea rax, [rbp -1]
	mov rax, [rax]
	pop rbx
	add rax, rbx

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