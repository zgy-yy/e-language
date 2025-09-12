	.section	__TEXT,__text,regular,pure_instructions
	.globl	_main                           ; -- Begin function main
	.p2align	2
_main:                                  ; @main
	.cfi_startproc
; %bb.0:                                ; %entry
	stp	x20, x19, [sp, #-32]!           ; 16-byte Folded Spill
	stp	x29, x30, [sp, #16]             ; 16-byte Folded Spill
	sub	sp, sp, #496
	.cfi_def_cfa_offset 528
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	.cfi_offset w19, -24
	.cfi_offset w20, -32
	mov	w9, #10                         ; =0xa
	add	x8, sp, #436
	mov	x12, #1                         ; =0x1
	str	w9, [sp, #464]
	mov	x9, #20                         ; =0x14
	movk	x12, #2, lsl #32
	movk	x9, #30, lsl #32
	mov	x14, #2                         ; =0x2
	mov	x10, #40                        ; =0x28
	stur	x9, [x8, #32]
	add	x9, sp, #156
	movk	x14, #3, lsl #32
	str	x12, [x9, #264]
	movk	x10, #50, lsl #32
	mov	w11, #3                         ; =0x3
	stur	x14, [x8, #4]
	ldr	w14, [sp, #424]
	mov	x13, #100                       ; =0x64
	stp	x10, x12, [x8, #40]
	movk	x13, #200, lsl #32
	mov	w10, #1                         ; =0x1
	str	w14, [sp, #432]
	ldr	w14, [sp, #480]
	ldur	q0, [x8, #28]
	str	w11, [sp, #492]
Lloh0:
	adrp	x19, l_format@PAGE
Lloh1:
	add	x19, x19, l_format@PAGEOFF
	str	w11, [sp, #428]
	mov	x0, x19
	str	w11, [sp, #412]
	str	w11, [sp, #416]
	mov	w11, w14
	str	w11, [sp, #400]
	mov	x11, #200                       ; =0xc8
	movk	x11, #300, lsl #32
	str	q0, [x9, #224]
	ldur	q0, [x8, #28]
	stur	x11, [x9, #212]
	mov	w11, #100                       ; =0x64
	str	w11, [sp, #364]
	add	x11, sp, #73
	stur	q0, [x11, #255]
	ldur	q0, [x8, #28]
	mov	w11, #300                       ; =0x12c
	str	x13, [sp, #352]
	ldr	w15, [sp, #328]
	str	x13, [sp, #456]
	str	w14, [sp, #396]
	ldr	w14, [sp, #356]
	str	x13, [x8, #48]
	ldr	w13, [sp, #364]
	stur	q0, [x9, #152]
	ldur	q0, [x8, #28]
	ldr	w16, [sp, #312]
	str	w11, [sp, #492]
	str	w11, [sp, #360]
	add	w11, w13, w14
	ldr	w13, [sp, #480]
	str	w11, [sp, #376]
	mul	w11, w15, w16
	ldr	w14, [sp, #492]
	str	x12, [x9, #248]
	ldr	w12, [sp, #480]
	ldr	w16, [sp, #456]
	str	w13, [sp, #324]
	add	x13, sp, #25
	ldr	w15, [sp, #492]
	str	w11, [sp, #348]
	mov	w11, #999                       ; =0x3e7
	str	w11, [sp, #468]
	ldr	w11, [sp, #480]
	stur	q0, [x13, #255]
	ldur	q0, [x8, #28]
	ldr	x13, [x8, #48]
	str	w12, [sp, #344]
	ldr	w12, [sp, #480]
	str	w11, [sp, #272]
	mov	w11, #888                       ; =0x378
	stur	q0, [x9, #100]
	str	w11, [sp, #476]
	ldr	x11, [x8, #48]
	str	w12, [sp, #296]
	ldr	w12, [sp, #268]
	ldur	q0, [x8, #28]
	str	x11, [x9, #72]
	ldr	w11, [sp, #492]
	str	w12, [sp, #276]
	ldr	w12, [sp, #492]
	str	w10, [sp, #436]
	str	w10, [sp, #448]
	str	w10, [sp, #304]
	ldr	w10, [sp, #284]
	str	w14, [sp, #236]
	ldr	x14, [x8, #48]
	str	w11, [sp, #224]
	ldr	x11, [x8, #48]
	str	w12, [sp, #248]
	and	x12, x13, #0xffffffff
	str	x13, [sp, #240]
	ldr	w13, [sp, #232]
	str	w10, [sp, #300]
	ldr	w10, [sp, #480]
	str	x14, [sp, #216]
	ldr	w14, [sp, #460]
	add	w12, w12, w13
	str	x11, [sp, #200]
	ldr	w11, [sp, #224]
	add	w13, w14, #1
	str	w10, [sp, #196]
	ldr	w10, [sp, #492]
	add	w11, w12, w11
	add	w12, w16, #1
	stur	q0, [x9, #24]
	stp	w12, w13, [sp, #172]
	ldur	q0, [x8, #28]
	ldr	w14, [sp, #200]
	str	w11, [sp, #252]
	mov	w11, w12
	ldr	w16, [sp, #180]
	str	w12, [sp, #456]
	ldr	x12, [x8, #48]
	str	w10, [sp, #164]
	ldr	w10, [sp, #480]
	add	w14, w14, w16
	str	x12, [x9]
	ldr	x12, [x8, #48]
	mul	w11, w14, w11
	stur	q0, [sp, #136]
	ldur	q0, [x8, #28]
	ldr	w9, [sp, #156]
	str	w10, [sp, #152]
	ldr	w10, [sp, #136]
	stur	q0, [sp, #100]
	cmp	w9, w10
	lsr	x9, x12, #32
	ldr	w10, [sp, #104]
	str	w13, [sp, #460]
	ldr	w13, [sp, #480]
	cset	w8, gt
	stp	w15, w11, [sp, #208]
	ldr	w11, [sp, #492]
	cmp	w9, w10
	ldr	w9, [sp, #448]
	strb	w8, [sp, #171]
	cset	w8, eq
	str	x12, [sp, #120]
	str	w11, [sp, #128]
	str	w13, [sp, #116]
	strb	w8, [sp, #135]
	str	x9, [sp]
	bl	_printf
	ldr	w8, [sp, #432]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #416]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #400]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #376]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #348]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #300]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #276]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #252]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #212]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldrb	w8, [sp, #171]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldrb	w8, [sp, #135]
	mov	x0, x19
	str	x8, [sp]
	bl	_printf
	ldr	w8, [sp, #492]
	ldr	w9, [sp, #488]
	mov	x0, x19
	ldr	w10, [sp, #484]
	stp	w9, w8, [sp, #92]
	str	w10, [sp, #88]
	str	x10, [sp]
	bl	_printf
	ldr	w8, [sp, #492]
	ldr	w9, [sp, #484]
	mov	x0, x19
	ldr	w10, [sp, #488]
	str	w9, [sp, #76]
	stp	w10, w8, [sp, #80]
	str	x10, [sp]
	bl	_printf
	ldr	w8, [sp, #484]
	ldr	w9, [sp, #488]
	mov	x0, x19
	ldr	w10, [sp, #492]
	stp	w8, w9, [sp, #64]
	str	w10, [sp, #72]
	str	x10, [sp]
	bl	_printf
	ldr	x8, [sp, #472]
	ldr	w9, [sp, #480]
	mov	x0, x19
	ldr	w10, [sp, #468]
	stur	x8, [sp, #52]
	ldr	w8, [sp, #464]
	str	w9, [sp, #60]
	stp	w8, w10, [sp, #44]
	str	x10, [sp]
	bl	_printf
	ldr	x8, [sp, #464]
	ldr	w9, [sp, #480]
	mov	x0, x19
	ldr	w10, [sp, #476]
	str	x8, [sp, #24]
	ldr	w8, [sp, #472]
	stp	w10, w9, [sp, #36]
	str	w8, [sp, #32]
	str	x10, [sp]
	bl	_printf
	ldr	w8, [sp, #460]
	ldr	w9, [sp, #456]
	mov	x0, x19
	stp	w9, w8, [sp, #16]
	str	x9, [sp]
	bl	_printf
	ldr	w8, [sp, #456]
	ldr	w9, [sp, #460]
	mov	x0, x19
	stp	w8, w9, [sp, #8]
	str	x9, [sp]
	bl	_printf
	mov	w0, wzr
	add	sp, sp, #496
	ldp	x29, x30, [sp, #16]             ; 16-byte Folded Reload
	ldp	x20, x19, [sp], #32             ; 16-byte Folded Reload
	ret
	.loh AdrpAdd	Lloh0, Lloh1
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
	.p2align	4, 0x0                          ; @format
l_format:
	.asciz	"in llvm fun, value = %d\n"

.subsections_via_symbols
