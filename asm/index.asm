section .data
	format db "Result: %d", 0x0a, 0
section .text
	global main
	extern printf
main:
	push rbp
	mov rbp, rsp
	sub rsp, 24
	lea rax, [rbp -8]
	push rax
	mov rax, 0
	pop rdi
	mov [rdi], rax
	lea rax, [rbp -16]
	push rax
	mov rax, 0
	pop rdi
	mov [rdi], rax
while0:
	mov rax, 9
	push rax
	lea rax, [rbp -16]
	mov rax, [rax]
	pop rbx
	cmp rax, rbx
	setl al
	movzx rax, al
	cmp rax, 0
	je  end0
	lea rax, [rbp -24]
	push rax
	mov rax, 0
	pop rdi
	mov [rdi], rax
while1:
	mov rax, 10
	push rax
	lea rax, [rbp -24]
	mov rax, [rax]
	pop rbx
	cmp rax, rbx
	setl al
	movzx rax, al
	cmp rax, 0
	je  end1
	lea rax, [rbp -8]
	push rax
	mov rax, 1
	push rax
	lea rax, [rbp -8]
	mov rax, [rax]
	pop rbx
	add rax, rbx
	pop rdi
	mov  [rdi], rax
	push rax
	lea rax, [rbp -8]
	mov rax, [rax]

;调用 printf
	lea rdi, [rel format]
	mov rsi, rax
	xor eax, eax
	call printf wrt ..plt
	jmp end1
	lea rax, [rbp -24]
	push rax
	mov rax, 1
	push rax
	lea rax, [rbp -24]
	mov rax, [rax]
	pop rbx
	add rax, rbx
	pop rdi
	mov  [rdi], rax
	push rax
	jmp while1
end1:
	lea rax, [rbp -16]
	push rax
	mov rax, 1
	push rax
	lea rax, [rbp -16]
	mov rax, [rax]
	pop rbx
	add rax, rbx
	pop rdi
	mov  [rdi], rax
	push rax
	jmp while0
end0:

;退出程序
	mov eax, 60
	xor edi, edi
	syscall
section .note.GNU-stack noalloc noexec nowrite progbits