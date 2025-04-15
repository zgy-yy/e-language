section .data
	format db "Result: %d", 0x0a, 0
section .text
	global main
	extern printf

;函数声明
	jmp fn_end
fn:
	push rbp
	mov rbp, rsp
	sub rsp, 16
;函数参数
	mov [rbp -8], rdi
	mov [rbp -16], rsi

;if 语句
	lea rax, [rbp + -16]
	mov rax, [rax]
	push rax
	lea rax, [rbp + -8]
	mov rax, [rax]
	pop rbx
	cmp rax, rbx
	setg al
	movzx rax, al
	push rax
	cmp rax, 0
	je  if_end1
	lea rax, [rbp + -8]
	mov rax, [rax]
	mov rsp, rbp
	pop rbp
	ret
	jmp if_end1
if_end1:
	lea rax, [rbp + -16]
	mov rax, [rax]
	mov rsp, rbp
	pop rbp
	ret
fn_end:
;函数声明结束


;函数声明
	jmp main_end
main:
	push rbp
	mov rbp, rsp
	sub rsp, 8
;函数参数
	lea rax, [rbp -8]
	push rax

;函数调用 开始
	mov rax, 2
	mov rsi, rax
	mov rax, 1
	mov rdi, rax
	lea rax, [rel fn]
	call rax
;函数调用 结束
	pop rdi
	mov [rdi], rax
	lea rax, [rbp + -8]
	mov rax, [rax]

;调用 printf
	lea rdi, [rel format]
	mov rsi, rax
	xor eax, eax
	call printf wrt ..plt
	mov rax, 0
	mov rsp, rbp
	pop rbp
	ret
main_end:
;函数声明结束

section .note.GNU-stack noalloc noexec nowrite progbits
