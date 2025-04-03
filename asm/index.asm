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
	sub rsp, 0

;函数声明
	jmp fn_foo_0_end
fn_foo_0:
	push rbp
	mov rbp, rsp
	sub rsp, 0
	mov rax, 12

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
fn_foo_0_end:

	mov rsp, rbp
	pop rbp
	mov eax , 0
	ret
;函数声明结束
main_end:

section .note.GNU-stack noalloc noexec nowrite progbits
