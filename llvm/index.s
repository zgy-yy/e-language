	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main                           ; -- Begin function main
	.p2align	2
_main:                                  ; @main
	.cfi_startproc
; %bb.0:                                ; %entry
	sub	sp, sp, #32
	.cfi_def_cfa_offset 32
	mov	w8, #1                          ; =0x1
	mov	x9, #3                          ; =0x3
	mov	w0, wzr
	str	w8, [sp, #24]
	movk	x9, #4, lsl #32
	str	w8, [sp, #16]
	strb	w8, [sp, #20]
	mov	x8, #1                          ; =0x1
	movk	x8, #2, lsl #32
	strb	wzr, [sp, #28]
	stp	x8, x9, [sp], #32
	ret
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
	.p2align	4, 0x0                          ; @format
l_format:
	.asciz	"in llvm fun, value = %d\n"

.subsections_via_symbols
