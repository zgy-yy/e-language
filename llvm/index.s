	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main                           ; -- Begin function main
	.p2align	2
_main:                                  ; @main
	.cfi_startproc
; %bb.0:                                ; %entry
	stp	x22, x21, [sp, #-48]!           ; 16-byte Folded Spill
	stp	x20, x19, [sp, #16]             ; 16-byte Folded Spill
	stp	x29, x30, [sp, #32]             ; 16-byte Folded Spill
	add	x29, sp, #32
	sub	sp, sp, #32
	.cfi_def_cfa w29, 16
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	.cfi_offset w19, -24
	.cfi_offset w20, -32
	.cfi_offset w21, -40
	.cfi_offset w22, -48
	mov	x8, #3                          ; =0x3
	mov	w9, #1                          ; =0x1
Lloh0:
	adrp	x19, l_format@PAGE
Lloh1:
	add	x19, x19, l_format@PAGEOFF
	movk	x8, #4, lsl #32
	stur	w9, [x29, #-56]
	stur	x8, [x29, #-52]
	mov	w8, #2                          ; =0x2
LBB0_1:                                 ; %for_cond_0
                                        ; =>This Inner Loop Header: Depth=1
	cmp	w8, #11
	stur	w8, [x29, #-60]
	b.gt	LBB0_3
; %bb.2:                                ; %for_body_0
                                        ;   in Loop: Header=BB0_1 Depth=1
	ldur	w8, [x29, #-60]
	mov	x0, x19
	str	x8, [sp, #-16]!
	bl	_printf
	add	sp, sp, #16
	ldur	w8, [x29, #-60]
	add	w8, w8, #1
	b	LBB0_1
LBB0_3:                                 ; %for_end_0
	cbnz	wzr, LBB0_5
; %bb.4:                                ; %if_then_0
Lloh2:
	adrp	x0, l_format@PAGE
Lloh3:
	add	x0, x0, l_format@PAGEOFF
	str	xzr, [sp, #-16]!
	bl	_printf
	add	sp, sp, #16
LBB0_5:                                 ; %do_body_0.preheader
	mov	w20, #23                        ; =0x17
Lloh4:
	adrp	x19, l_format@PAGE
Lloh5:
	add	x19, x19, l_format@PAGEOFF
	mov	w21, #1                         ; =0x1
LBB0_6:                                 ; %do_body_0
                                        ; =>This Inner Loop Header: Depth=1
	mov	x0, x19
	str	x20, [sp, #-16]!
	bl	_printf
	add	sp, sp, #16
	cbnz	w21, LBB0_6
; %bb.7:                                ; %for_init_1
	sub	x20, sp, #16
	mov	sp, x20
	mov	w8, wzr
Lloh6:
	adrp	x19, l_format@PAGE
Lloh7:
	add	x19, x19, l_format@PAGEOFF
LBB0_8:                                 ; %for_cond_1
                                        ; =>This Inner Loop Header: Depth=1
	cmp	w8, #12
	str	w8, [x20]
	b.gt	LBB0_10
; %bb.9:                                ; %for_body_1
                                        ;   in Loop: Header=BB0_8 Depth=1
	ldur	x8, [x29, #-56]
	mov	x0, x19
	str	x8, [sp, #-16]!
	bl	_printf
	add	sp, sp, #16
	ldr	w8, [x20]
	add	w8, w8, #1
	b	LBB0_8
LBB0_10:                                ; %for_end_1
	mov	w0, wzr
	sub	sp, x29, #32
	ldp	x29, x30, [sp, #32]             ; 16-byte Folded Reload
	ldp	x20, x19, [sp, #16]             ; 16-byte Folded Reload
	ldp	x22, x21, [sp], #48             ; 16-byte Folded Reload
	ret
	.loh AdrpAdd	Lloh0, Lloh1
	.loh AdrpAdd	Lloh2, Lloh3
	.loh AdrpAdd	Lloh4, Lloh5
	.loh AdrpAdd	Lloh6, Lloh7
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
	.p2align	4, 0x0                          ; @format
l_format:
	.asciz	"in llvm fun, value = %d\n"

.subsections_via_symbols
