section .data
	format db "Result: %d", 0x0a, 0
	a dq 0
section .text
	global main
	extern printf
main:
	mov rax, 1
	mov [a], rax
	call fn_main_0

;退出程序
	mov eax, 60
	xor edi, edi
	syscall

;函数声明
fn_main_0:
	push rbp
	mov rbp, rsp
	sub rsp, 16
	lea rax, [rbp -8]
	push rax
	mov rax, 2
	pop rdi
	mov [rdi], rax
	lea rax, [rbp -16]
	push rax
	mov rax, 3
	pop rdi
	mov [rdi], rax
	lea rax, [rbp -16]
	mov rax, [rax]

;调用 printf
	lea rdi, [rel format]
	mov rsi, rax
	xor eax, eax
	call printf wrt ..plt
	lea rax, [rbp -8]
	mov rax, [rax]

;调用 printf
	lea rdi, [rel format]
	mov rsi, rax
	xor eax, eax
	call printf wrt ..plt
	leave
	ret
section .note.GNU-stack noalloc noexec nowrite progbits
