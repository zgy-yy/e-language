section .data
	format db "Result: %d", 0x0a, 0
section .text
	global main
	extern printf
main:
	push rbp
	mov rbp, rsp
	sub rsp, 8
	lea rax, [rbp -8]
	push rax
	mov rax, 0
	pop rdi
	mov [rdi], rax
do0:
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

;if 语句
	mov rax, 5
	push rax
	lea rax, [rbp -8]
	mov rax, [rax]
	pop rbx
	cmp rax, rbx
	sete al
	movzx rax, al
	push rax
	cmp rax, 0
	je  if_end1
	jmp do0
	jmp if_end1
if_end1:
	lea rax, [rbp -8]
	mov rax, [rax]

;调用 printf
	lea rdi, [rel format]
	mov rsi, rax
	xor eax, eax
	call printf wrt ..plt
	mov rax, 10
	push rax
	lea rax, [rbp -8]
	mov rax, [rax]
	pop rbx
	cmp rax, rbx
	setl al
	movzx rax, al
	cmp rax, 0
	jne do0
do_end0:

;退出程序
	mov eax, 60
	xor edi, edi
	syscall
section .note.GNU-stack noalloc noexec nowrite progbits