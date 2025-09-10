	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main                           ; -- Begin function main
	.p2align	2
_main:                                  ; @main
	.cfi_startproc
; %bb.0:                                ; %entry
	sub	sp, sp, #32
	stp	x29, x30, [sp, #16]             ; 16-byte Folded Spill
	.cfi_def_cfa_offset 32
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	adrp	x8, _main.fn@PAGE
Lloh0:
	adrp	x9, _anonymous.8828@PAGE
Lloh1:
	add	x9, x9, _anonymous.8828@PAGEOFF
	mov	w0, #3                          ; =0x3
	str	x9, [x8, _main.fn@PAGEOFF]
	blr	x9
	mov	w8, w0
	str	w0, [sp, #12]
Lloh2:
	adrp	x0, l_format@PAGE
Lloh3:
	add	x0, x0, l_format@PAGEOFF
	str	x8, [sp]
	bl	_printf
	ldp	x29, x30, [sp, #16]             ; 16-byte Folded Reload
	mov	w0, wzr
	add	sp, sp, #32
	ret
	.loh AdrpAdd	Lloh2, Lloh3
	.loh AdrpAdd	Lloh0, Lloh1
	.cfi_endproc
                                        ; -- End function
	.globl	_anonymous.8828                 ; -- Begin function anonymous.8828
	.p2align	2
_anonymous.8828:                        ; @anonymous.8828
	.cfi_startproc
; %bb.0:                                ; %entry
	sub	sp, sp, #48
	stp	x20, x19, [sp, #16]             ; 16-byte Folded Spill
	stp	x29, x30, [sp, #32]             ; 16-byte Folded Spill
	.cfi_def_cfa_offset 48
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	.cfi_offset w19, -24
	.cfi_offset w20, -32
	cmp	w0, #0
	str	w0, [sp, #12]
	b.gt	LBB1_2
; %bb.1:
	mov	w0, wzr
	b	LBB1_3
LBB1_2:                                 ; %if_end0
	ldr	w19, [sp, #12]
Lloh4:
	adrp	x8, _main.fn@PAGE
Lloh5:
	ldr	x8, [x8, _main.fn@PAGEOFF]
	sub	w0, w19, #1
	blr	x8
	add	w0, w19, w0
LBB1_3:                                 ; %common.ret
	ldp	x29, x30, [sp, #32]             ; 16-byte Folded Reload
	ldp	x20, x19, [sp, #16]             ; 16-byte Folded Reload
	add	sp, sp, #48
	ret
	.loh AdrpLdr	Lloh4, Lloh5
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
	.p2align	4, 0x0                          ; @format
l_format:
	.asciz	"in llvm fun, value = %d\n"

	.globl	_main.fn                        ; @main.fn
.zerofill __DATA,__common,_main.fn,8,3
.subsections_via_symbols
