	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main                           ; -- Begin function main
	.p2align	2
_main:                                  ; @main
	.cfi_startproc
; %bb.0:                                ; %entry
	sub	sp, sp, #48
	stp	x29, x30, [sp, #32]             ; 16-byte Folded Spill
	.cfi_def_cfa_offset 48
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	mov	x8, #3                          ; =0x3
	mov	x9, #4                          ; =0x4
Lloh0:
	adrp	x0, l_format@PAGE
Lloh1:
	add	x0, x0, l_format@PAGEOFF
	movk	x8, #6, lsl #32
	movk	x9, #5, lsl #32
	stp	x9, x8, [sp, #16]
	mov	x8, #23                         ; =0x17
	movk	x8, #9, lsl #32
	str	x8, [sp, #8]
	mov	w8, #9                          ; =0x9
	str	x8, [sp]
	bl	_printf
	ldp	x29, x30, [sp, #32]             ; 16-byte Folded Reload
	mov	w0, wzr
	add	sp, sp, #48
	ret
	.loh AdrpAdd	Lloh0, Lloh1
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
	.p2align	4, 0x0                          ; @format
l_format:
	.asciz	"in llvm fun, value = %d\n"

.subsections_via_symbols
