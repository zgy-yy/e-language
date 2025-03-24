section .data
	format db "Result: % d", 0x0a, 0
section .text
	global main
	extern printf
main:
	push rbp
	mov rbp, rsp
	sub rsp, 8
	lea rax, [rbp -8]
	push rax
	mov rax, 1
	pop rdi
	mov [rdi], rax
	mov rax, 10
	push rax
	lea rax, [rbp -8]
	mov rax, [rax]
	pop rbx
	cmp rax, rbx
	setg al
	movzx rax, al
	push rax

;if 语句
	cmp rax, 0
	je  else0
	mov rax, 1

;调用 printf
	lea rdi, [rel format]
	mov rsi, rax
	xor eax, eax
	call printf wrt ..plt
else0:
	mov rax, 2

;调用 printf
	lea rdi, [rel format]
	mov rsi, rax
	xor eax, eax
	call printf wrt ..plt
end0:

;退出程序
	mov eax, 60
	xor edi, edi
	syscall
section .note.GNU-stack noalloc noexec nowrite progbits