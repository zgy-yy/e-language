section .data
	format db "Result: %d", 0x0a, 0
section .text
	global main
	extern printf
main:
	push rbp
	mov rbp, rsp
	sub rsp, 16
	lea rax, [rbp -8]
	push rax
	mov rax, 2
	pop rdi
	mov [rdi], rax
	lea rax, [rbp -8]
	push rax
	lea rax, [rbp -8]
	mov rax, [rax]
	mov rbx, rax
	inc rbx
	lea rdi, [rbp -8]
	mov [rdi], rbx
	pop rdi
	mov  [rdi], rax
	push rax
for0:
	lea rax, [rbp -16]
	push rax
	mov rax, 0
	pop rdi
	mov [rdi], rax
for_condition0:
	mov rax, 10
	push rax
	lea rax, [rbp -16]
	mov rax, [rax]
	pop rbx
	cmp rax, rbx
	setl al
	movzx rax, al
	cmp rax, 0
	je for_end0
	lea rax, [rbp -16]
	mov rax, [rax]

;调用 printf
	lea rdi, [rel format]
	mov rsi, rax
	xor eax, eax
	call printf wrt ..plt
for_increment0:
	lea rax, [rbp -16]
	mov rax, [rax]
	mov rbx, rax
	inc rbx
	lea rdi, [rbp -16]
	mov [rdi], rbx
	jmp for_condition0
for_end0:
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
