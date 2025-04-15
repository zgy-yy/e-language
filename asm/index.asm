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
	sub rsp, 48
;函数参数
	mov [rbp -8], rdi
	mov [rbp -16], rsi
	mov [rbp -24], rdx
	mov [rbp -32], rcx
	mov [rbp -40], r8
	mov [rbp -48], r9
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
	mov rax, 8
	push rax
	mov rax, 7
	push rax
	mov rax, 6
	mov r9, rax
	mov rax, 5
	mov r8, rax
	mov rax, 4
	mov rcx, rax
	mov rax, 3
	mov rdx, rax
	mov rax, 2
	mov rsi, rax
	mov rax, 1
	mov rdi, rax
	lea rax, [rel fn]
	call rax
;函数参数清理
	add rsp, 16
;函数调用 结束
	pop rdi
	mov [rdi], rax
	mov rax, 0
	mov rsp, rbp
	pop rbp
	ret
main_end:
;函数声明结束

section .note.GNU-stack noalloc noexec nowrite progbits
