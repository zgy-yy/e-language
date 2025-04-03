section .data
	format db "Result: %d", 0x0a, 0
section .text
	global main
	extern printf

;函数声明
	jmp main_end
main:
	push rbp
	mov rbp, rsp
	sub rsp, 8
	lea rax, [rbp -8]
	push rax
	mov rax, 12
	pop rdi
	mov [rdi], rax
	lea rax, [rbp -8]
	push rax
	mov rax, 3
	push rax
	mov rax, 1
	mov rax, 2
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
	mov rsp, rbp
	pop rbp
	mov eax , 0
	ret
;函数声明结束
main_end:

section .note.GNU-stack noalloc noexec nowrite progbits
