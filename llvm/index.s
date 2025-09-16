	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main                           ; -- Begin function main
	.p2align	2
_main:                                  ; @main
	.cfi_startproc
; %bb.0:                                ; %entry
	sub	sp, sp, #64
	stp	x20, x19, [sp, #32]             ; 16-byte Folded Spill
	stp	x29, x30, [sp, #48]             ; 16-byte Folded Spill
	.cfi_def_cfa_offset 64
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	.cfi_offset w19, -24
	.cfi_offset w20, -32
Lloh0:
	adrp	x19, l_format@PAGE
Lloh1:
	add	x19, x19, l_format@PAGEOFF
	mov	w20, #23                        ; =0x17
	mov	w8, #78                         ; =0x4e
	mov	x0, x19
	strb	wzr, [sp, #20]
	str	w20, [sp, #16]
	str	w8, [sp, #24]
	str	x8, [sp]
	bl	_printf
	mov	x8, #90                         ; =0x5a
	mov	x0, x19
	movk	x8, #23, lsl #32
	stp	x20, x8, [sp]
	bl	_printf
	ldp	x29, x30, [sp, #48]             ; 16-byte Folded Reload
	mov	w0, wzr
	ldp	x20, x19, [sp, #32]             ; 16-byte Folded Reload
	add	sp, sp, #64
	ret
	.loh AdrpAdd	Lloh0, Lloh1
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
	.p2align	4, 0x0                          ; @format
l_format:
	.asciz	"in llvm fun, value = %d\n"

.subsections_via_symbols
