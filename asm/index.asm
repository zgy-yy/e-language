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
	mov rax, 5
	push rax
	mov rax, 15
	pop rbx
	cmp rax, rbx
	setl al
	movzx rax, al
	cmp rax, 0
	jne  end0
	mov rax, 3
	push rax
	mov rax, 5
	pop rbx
	cmp rax, rbx
	setl al
	movzx rax, al
	cmp rax, 0
	jne  end0
	mov rax, 0
end0:
	pop rdi
	mov [rdi], rax
	lea rax, [rbp -8]
	mov rax, [rax]

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