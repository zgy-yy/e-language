	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main                           ; -- Begin function main
	.p2align	2
_main:                                  ; @main
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
	mov	w8, #1                          ; =0x1
Lloh0:
	adrp	x19, l_format@PAGE
Lloh1:
	add	x19, x19, l_format@PAGEOFF
	str	w8, [sp, #12]
LBB0_1:                                 ; %for_cond_0
                                        ; =>This Inner Loop Header: Depth=1
	cmp	w8, #1
	str	w8, [sp, #8]
	b.gt	LBB0_3
; %bb.2:                                ; %for_body_0
                                        ;   in Loop: Header=BB0_1 Depth=1
	ldr	w8, [sp, #8]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #8]
	add	w8, w8, #1
	b	LBB0_1
LBB0_3:                                 ; %for_end_0
	ldr	w8, [sp, #12]
	mov	w9, #2                          ; =0x2
Lloh2:
	adrp	x19, l_format@PAGE
Lloh3:
	add	x19, x19, l_format@PAGEOFF
	cmp	w8, #4
	csel	w8, w8, w9, gt
LBB0_4:                                 ; %while_cond_0
                                        ; =>This Inner Loop Header: Depth=1
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #12]
	cmp	w8, #12
	b.ge	LBB0_6
; %bb.5:                                ; %while_body_0
                                        ;   in Loop: Header=BB0_4 Depth=1
	ldr	w8, [sp, #12]
	add	w8, w8, #1
	str	w8, [sp, #12]
	b	LBB0_4
LBB0_6:
Lloh4:
	adrp	x19, l_format@PAGE
Lloh5:
	add	x19, x19, l_format@PAGEOFF
LBB0_7:                                 ; %do_body_0
                                        ; =>This Inner Loop Header: Depth=1
	ldr	w8, [sp, #12]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #12]
	add	w8, w8, #1
	str	w8, [sp, #12]
	b	LBB0_7
	.loh AdrpAdd	Lloh0, Lloh1
	.loh AdrpAdd	Lloh2, Lloh3
	.loh AdrpAdd	Lloh4, Lloh5
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
	.p2align	4, 0x0                          ; @format
l_format:
	.asciz	"in llvm fun, value = %d\n"

.subsections_via_symbols
