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
Lloh0:
	adrp	x8, _anonymous.C26E@PAGE
Lloh1:
	add	x8, x8, _anonymous.C26E@PAGEOFF
Lloh2:
	adrp	x0, _fo.11FA@PAGE
Lloh3:
	add	x0, x0, _fo.11FA@PAGEOFF
	mov	w1, #1                          ; =0x1
	str	x8, [sp, #8]
	blr	x8
	ldp	x29, x30, [sp, #16]             ; 16-byte Folded Reload
	mov	w0, wzr
	add	sp, sp, #32
	ret
	.loh AdrpAdd	Lloh2, Lloh3
	.loh AdrpAdd	Lloh0, Lloh1
	.cfi_endproc
                                        ; -- End function
	.globl	_fo.11FA                        ; -- Begin function fo.11FA
	.p2align	2
_fo.11FA:                               ; @fo.11FA
	.cfi_startproc
; %bb.0:                                ; %entry
	sub	sp, sp, #32
	stp	x29, x30, [sp, #16]             ; 16-byte Folded Spill
	.cfi_def_cfa_offset 32
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	mov	w8, w0
	str	w0, [sp, #12]
Lloh4:
	adrp	x0, l_format@PAGE
Lloh5:
	add	x0, x0, l_format@PAGEOFF
	str	x8, [sp]
	bl	_printf
	ldp	x29, x30, [sp, #16]             ; 16-byte Folded Reload
	add	sp, sp, #32
	ret
	.loh AdrpAdd	Lloh4, Lloh5
	.cfi_endproc
                                        ; -- End function
	.globl	_anonymous.C26E                 ; -- Begin function anonymous.C26E
	.p2align	2
_anonymous.C26E:                        ; @anonymous.C26E
	.cfi_startproc
; %bb.0:                                ; %entry
	sub	sp, sp, #32
	stp	x29, x30, [sp, #16]             ; 16-byte Folded Spill
	.cfi_def_cfa_offset 32
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	str	x0, [sp, #8]
	strb	w1, [sp, #7]
	tbz	w1, #0, LBB2_2
; %bb.1:                                ; %if_then0
	ldr	x8, [sp, #8]
	mov	w0, #23                         ; =0x17
	blr	x8
LBB2_2:                                 ; %if_end0
	ldp	x29, x30, [sp, #16]             ; 16-byte Folded Reload
	add	sp, sp, #32
	ret
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
	.p2align	4, 0x0                          ; @format
l_format:
	.asciz	"in llvm fun, value = %d\n"

.subsections_via_symbols
