
import { pgTable, pgEnum, pgSchema, AnyPgColumn, serial, bigint, varchar, uniqueIndex, timestamp, jsonb, integer, boolean, index, foreignKey, real, text, numeric, primaryKey } from "drizzle-orm/pg-core"

export const shippingOptionRequirementTypeEnum = pgEnum("shipping_option_requirement_type_enum", ['min_subtotal', 'max_subtotal'])
export const shippingOptionPriceTypeEnum = pgEnum("shipping_option_price_type_enum", ['flat_rate', 'calculated'])
export const shippingProfileTypeEnum = pgEnum("shipping_profile_type_enum", ['default', 'gift_card', 'custom'])
export const discountRuleTypeEnum = pgEnum("discount_rule_type_enum", ['fixed', 'percentage', 'free_shipping'])
export const discountRuleAllocationEnum = pgEnum("discount_rule_allocation_enum", ['total', 'item'])
export const paymentSessionStatusEnum = pgEnum("payment_session_status_enum", ['authorized', 'pending', 'requires_more', 'error', 'canceled'])
export const orderStatusEnum = pgEnum("order_status_enum", ['pending', 'completed', 'archived', 'canceled', 'requires_action'])
export const orderFulfillmentStatusEnum = pgEnum("order_fulfillment_status_enum", ['not_fulfilled', 'partially_fulfilled', 'fulfilled', 'partially_shipped', 'shipped', 'partially_returned', 'returned', 'canceled', 'requires_action'])
export const orderPaymentStatusEnum = pgEnum("order_payment_status_enum", ['not_paid', 'awaiting', 'captured', 'partially_refunded', 'refunded', 'canceled', 'requires_action'])
export const claimItemReasonEnum = pgEnum("claim_item_reason_enum", ['missing_item', 'wrong_item', 'production_failure', 'other'])
export const claimOrderPaymentStatusEnum = pgEnum("claim_order_payment_status_enum", ['na', 'not_refunded', 'refunded'])
export const claimOrderFulfillmentStatusEnum = pgEnum("claim_order_fulfillment_status_enum", ['not_fulfilled', 'partially_fulfilled', 'fulfilled', 'partially_shipped', 'shipped', 'partially_returned', 'returned', 'canceled', 'requires_action'])
export const claimOrderTypeEnum = pgEnum("claim_order_type_enum", ['refund', 'replace'])
export const refundReasonEnum = pgEnum("refund_reason_enum", ['discount', 'return', 'swap', 'claim', 'other'])
export const draftOrderStatusEnum = pgEnum("draft_order_status_enum", ['open', 'completed'])
export const returnStatusEnum = pgEnum("return_status_enum", ['requested', 'received', 'requires_action', 'canceled'])
export const swapPaymentStatusEnum = pgEnum("swap_payment_status_enum", ['not_paid', 'awaiting', 'captured', 'confirmed', 'canceled', 'difference_refunded', 'partially_refunded', 'refunded', 'requires_action'])
export const productStatusEnum = pgEnum("product_status_enum", ['draft', 'proposed', 'published', 'rejected'])
export const inviteRoleEnum = pgEnum("invite_role_enum", ['admin', 'member', 'developer'])
export const userRoleEnum = pgEnum("user_role_enum", ['admin', 'member', 'developer'])
export const cartTypeEnum = pgEnum("cart_type_enum", ['default', 'swap', 'draft_order', 'payment_link', 'claim'])
export const discountConditionTypeEnum = pgEnum("discount_condition_type_enum", ['products', 'product_types', 'product_collections', 'product_tags', 'customer_groups'])
export const discountConditionOperatorEnum = pgEnum("discount_condition_operator_enum", ['in', 'not_in'])
export const priceListTypeEnum = pgEnum("price_list_type_enum", ['sale', 'override'])
export const priceListStatusEnum = pgEnum("price_list_status_enum", ['active', 'draft'])
export const swapFulfillmentStatusEnum = pgEnum("swap_fulfillment_status_enum", ['not_fulfilled', 'fulfilled', 'shipped', 'partially_shipped', 'canceled', 'requires_action'])
export const orderItemChangeTypeEnum = pgEnum("order_item_change_type_enum", ['item_add', 'item_remove', 'item_update'])
export const paymentCollectionTypeEnum = pgEnum("PAYMENT_COLLECTION_TYPE_ENUM", ['order_edit'])
export const paymentCollectionStatusEnum = pgEnum("PAYMENT_COLLECTION_STATUS_ENUM", ['not_paid', 'awaiting', 'authorized', 'partially_authorized', 'canceled'])

export const idempotencyKey = pgTable("idempotency_key", {
	id: varchar("id").primaryKey().notNull(),
	idempotencyKey: varchar("idempotency_key").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lockedAt: timestamp("locked_at", { withTimezone: true, mode: 'string' }),
	requestMethod: varchar("request_method"),
	requestParams: jsonb("request_params"),
	requestPath: varchar("request_path"),
	responseCode: integer("response_code"),
	responseBody: jsonb("response_body"),
	recoveryPoint: varchar("recovery_point").default('started').notNull(),
},
(table) => {
	return {
		idxA421Bf4588D0004A9B0C0Fe84F: uniqueIndex("IDX_a421bf4588d0004a9b0c0fe84f").on(table.idempotencyKey),
	}
});

export const fulfillmentProvider = pgTable("fulfillment_provider", {
	id: varchar("id").primaryKey().notNull(),
	isInstalled: boolean("is_installed").default(true).notNull(),
});

export const oauth = pgTable("oauth", {
	id: varchar("id").primaryKey().notNull(),
	displayName: varchar("display_name").notNull(),
	applicationName: varchar("application_name").notNull(),
	installUrl: varchar("install_url"),
	uninstallUrl: varchar("uninstall_url"),
	data: jsonb("data"),
},
(table) => {
	return {
		idxC49C061B1A686843C5D673506F: uniqueIndex("IDX_c49c061b1a686843c5d673506f").on(table.applicationName),
	}
});

export const shippingProfile = pgTable("shipping_profile", {
	id: varchar("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	type: shippingProfileTypeEnum("type").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
});

export const paymentProvider = pgTable("payment_provider", {
	id: varchar("id").primaryKey().notNull(),
	isInstalled: boolean("is_installed").default(true).notNull(),
});

export const customer = pgTable("customer", {
	id: varchar("id").primaryKey().notNull(),
	email: varchar("email").notNull(),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
	billingAddressId: varchar("billing_address_id").references((): AnyPgColumn => address.id),
	passwordHash: varchar("password_hash"),
	phone: varchar("phone"),
	hasAccount: boolean("has_account").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx8Abe81B9Aac151Ae60Bf507Ad1: index("IDX_8abe81b9aac151ae60bf507ad1").on(table.billingAddressId),
		rel8Abe81B9Aac151Ae60Bf507Ad1: uniqueIndex("REL_8abe81b9aac151ae60bf507ad1").on(table.billingAddressId),
		uqUniqueEmailForGuestsAndCustomerAccounts: uniqueIndex("UQ_unique_email_for_guests_and_customer_accounts").on(table.email, table.hasAccount),
	}
});

export const image = pgTable("image", {
	id: varchar("id").primaryKey().notNull(),
	url: varchar("url").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
});

export const address = pgTable("address", {
	id: varchar("id").primaryKey().notNull(),
	customerId: varchar("customer_id").references((): AnyPgColumn => customer.id),
	company: varchar("company"),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
	address1: varchar("address_1"),
	address2: varchar("address_2"),
	city: varchar("city"),
	countryCode: varchar("country_code").references(() => country.iso2),
	province: varchar("province"),
	postalCode: varchar("postal_code"),
	phone: varchar("phone"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx9C9614B2F9D01665800Ea8Dbff: index("IDX_9c9614b2f9d01665800ea8dbff").on(table.customerId),
	}
});

export const productOption = pgTable("product_option", {
	id: varchar("id").primaryKey().notNull(),
	title: varchar("title").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	productId: varchar("product_id").references(() => product.id),
});

export const currency = pgTable("currency", {
	code: varchar("code").primaryKey().notNull(),
	symbol: varchar("symbol").notNull(),
	symbolNative: varchar("symbol_native").notNull(),
	name: varchar("name").notNull(),
});

export const country = pgTable("country", {
	id: serial("id").primaryKey().notNull(),
	iso2: varchar("iso_2").notNull(),
	iso3: varchar("iso_3").notNull(),
	numCode: integer("num_code").notNull(),
	name: varchar("name").notNull(),
	displayName: varchar("display_name").notNull(),
	regionId: varchar("region_id").references(() => region.id),
},
(table) => {
	return {
		idxB1Aac8314662Fa6B25569A575B: index("IDX_b1aac8314662fa6b25569a575b").on(table.regionId),
		idxE78901B1131Eaf8203D9B1Cb5F: uniqueIndex("IDX_e78901b1131eaf8203d9b1cb5f").on(table.iso2),
	}
});

export const payment = pgTable("payment", {
	id: varchar("id").primaryKey().notNull(),
	swapId: varchar("swap_id").references(() => swap.id),
	cartId: varchar("cart_id").references((): AnyPgColumn => cart.id),
	orderId: varchar("order_id").references(() => order.id),
	amount: integer("amount").notNull(),
	currencyCode: varchar("currency_code").notNull().references(() => currency.code),
	amountRefunded: integer("amount_refunded").notNull(),
	providerId: varchar("provider_id").notNull(),
	data: jsonb("data").notNull(),
	capturedAt: timestamp("captured_at", { withTimezone: true, mode: 'string' }),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
	idempotencyKey: varchar("idempotency_key"),
},
(table) => {
	return {
		idx4665F17Abc1E81Dd58330E5854: index("IDX_4665f17abc1e81dd58330e5854").on(table.cartId),
		idxAac4855Eadda71Aa1E4B6D7684: index("IDX_aac4855eadda71aa1e4b6d7684").on(table.cartId),
		idxC17Aff091441B7C25Ec3D68D36: index("IDX_c17aff091441b7c25ec3d68d36").on(table.swapId),
		idxEa94F42B6C88E9191C3649D752: index("IDX_ea94f42b6c88e9191c3649d752").on(table.providerId),
		idxF5221735Ace059250Daac9D980: index("IDX_f5221735ace059250daac9d980").on(table.orderId),
		idxPaymentCurrencyCode: index("IDX_payment_currency_code").on(table.currencyCode),
		relC17Aff091441B7C25Ec3D68D36: uniqueIndex("REL_c17aff091441b7c25ec3d68d36").on(table.swapId),
		uniquePaymentActive: uniqueIndex("UniquePaymentActive").on(table.cartId),
	}
});

export const productOptionValue = pgTable("product_option_value", {
	id: varchar("id").primaryKey().notNull(),
	value: varchar("value").notNull(),
	optionId: varchar("option_id").notNull().references(() => productOption.id),
	variantId: varchar("variant_id").notNull().references(() => productVariant.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idxProductOptionValueOptionId: index("idx_product_option_value_option_id").on(table.optionId),
		idxProductOptionValueVariantId: index("idx_product_option_value_variant_id").on(table.variantId),
	}
});

export const claimImage = pgTable("claim_image", {
	id: varchar("id").primaryKey().notNull(),
	claimItemId: varchar("claim_item_id").notNull().references(() => claimItem.id),
	url: varchar("url").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx21Cbfedd83D736D86F4C6F4Ce5: index("IDX_21cbfedd83d736d86f4c6f4ce5").on(table.claimItemId),
	}
});

export const productTag = pgTable("product_tag", {
	id: varchar("id").primaryKey().notNull(),
	value: varchar("value").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
});

export const notificationProvider = pgTable("notification_provider", {
	id: varchar("id").primaryKey().notNull(),
	isInstalled: boolean("is_installed").default(true).notNull(),
});

export const claimTag = pgTable("claim_tag", {
	id: varchar("id").primaryKey().notNull(),
	value: varchar("value").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idxEc10C54769877840C132260E4A: index("IDX_ec10c54769877840c132260e4a").on(table.value),
	}
});

export const productType = pgTable("product_type", {
	id: varchar("id").primaryKey().notNull(),
	value: varchar("value").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
});

export const productCollection = pgTable("product_collection", {
	id: varchar("id").primaryKey().notNull(),
	title: varchar("title").notNull(),
	handle: varchar("handle"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx6F234F058Bbbea810Dce1D04D0: uniqueIndex("IDX_6f234f058bbbea810dce1d04d0").on(table.handle),
		idxGinProductCollection: index("idx_gin_product_collection").on(table.title),
	}
});

export const shippingOption = pgTable("shipping_option", {
	id: varchar("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	regionId: varchar("region_id").notNull().references(() => region.id),
	profileId: varchar("profile_id").notNull().references(() => shippingProfile.id),
	providerId: varchar("provider_id").notNull().references(() => fulfillmentProvider.id),
	priceType: shippingOptionPriceTypeEnum("price_type").notNull(),
	amount: integer("amount"),
	isReturn: boolean("is_return").notNull(),
	data: jsonb("data").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	adminOnly: boolean("admin_only").notNull(),
},
(table) => {
	return {
		idx5C58105F1752Fca0F4Ce69F466: index("IDX_5c58105f1752fca0f4ce69f466").on(table.regionId),
		idxA0E206Bfaed3Cb63C186091734: index("IDX_a0e206bfaed3cb63c186091734").on(table.providerId),
		idxC951439Af4C98Bf2Bd7Fb8726C: index("IDX_c951439af4c98bf2bd7fb8726c").on(table.profileId),
	}
});

export const trackingLink = pgTable("tracking_link", {
	id: varchar("id").primaryKey().notNull(),
	url: varchar("url"),
	trackingNumber: varchar("tracking_number").notNull(),
	fulfillmentId: varchar("fulfillment_id").notNull().references(() => fulfillment.id),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	idempotencyKey: varchar("idempotency_key"),
});

export const notification = pgTable("notification", {
	id: varchar("id").primaryKey().notNull(),
	eventName: varchar("event_name"),
	resourceType: varchar("resource_type").notNull(),
	resourceId: varchar("resource_id").notNull(),
	customerId: varchar("customer_id").references(() => customer.id),
	to: varchar("to").notNull(),
	data: jsonb("data").notNull(),
	parentId: varchar("parent_id"),
	providerId: varchar("provider_id").references(() => notificationProvider.id),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		idxB5Df0F53A74B9D0C0A2B652C88: index("IDX_b5df0f53a74b9d0c0a2b652c88").on(table.customerId),
		idxDf1494D263740Fcfb1D09A98Fc: index("IDX_df1494d263740fcfb1d09a98fc").on(table.resourceType),
		idxEa6A358D9Ce41C16499Aae55F9: index("IDX_ea6a358d9ce41c16499aae55f9").on(table.resourceId),
		fk371Db513192C083F48Ba63C33Be: foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id]
		}),
	}
});

export const discount = pgTable("discount", {
	id: varchar("id").primaryKey().notNull(),
	code: varchar("code").notNull(),
	isDynamic: boolean("is_dynamic").notNull(),
	ruleId: varchar("rule_id").references(() => discountRule.id),
	isDisabled: boolean("is_disabled").notNull(),
	parentDiscountId: varchar("parent_discount_id"),
	startsAt: timestamp("starts_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	endsAt: timestamp("ends_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	usageLimit: integer("usage_limit"),
	usageCount: integer("usage_count").notNull(),
	validDuration: varchar("valid_duration"),
},
(table) => {
	return {
		idxAc2C280De3701B2D66F6817F76: index("IDX_ac2c280de3701b2d66f6817f76").on(table.ruleId),
		idxF65Bf52E2239Ace276Ece2B2F4: uniqueIndex("IDX_f65bf52e2239ace276ece2b2f4").on(table.code),
		fk2250C5D9E975987Ab212F61A663: foreignKey({
			columns: [table.parentDiscountId],
			foreignColumns: [table.id]
		}),
	}
});

export const claimItem = pgTable("claim_item", {
	id: varchar("id").primaryKey().notNull(),
	claimOrderId: varchar("claim_order_id").notNull().references(() => claimOrder.id),
	itemId: varchar("item_id").notNull().references(() => lineItem.id),
	variantId: varchar("variant_id").notNull().references(() => productVariant.id),
	reason: claimItemReasonEnum("reason").notNull(),
	note: varchar("note"),
	quantity: integer("quantity").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx64980511Ca32C8E92B417644Af: index("IDX_64980511ca32c8e92b417644af").on(table.variantId),
		idx6E0Cad0Daef76Bb642675910B9: index("IDX_6e0cad0daef76bb642675910b9").on(table.itemId),
		idx900A9C3834257304396B2B0Fe7: index("IDX_900a9c3834257304396b2b0fe7").on(table.claimOrderId),
	}
});

export const productVariant = pgTable("product_variant", {
	id: varchar("id").primaryKey().notNull(),
	title: varchar("title").notNull(),
	productId: varchar("product_id").notNull().references(() => product.id),
	sku: varchar("sku"),
	barcode: varchar("barcode"),
	ean: varchar("ean"),
	upc: varchar("upc"),
	inventoryQuantity: integer("inventory_quantity").notNull(),
	allowBackorder: boolean("allow_backorder").notNull(),
	manageInventory: boolean("manage_inventory").default(true).notNull(),
	hsCode: varchar("hs_code"),
	originCountry: varchar("origin_country"),
	midCode: varchar("mid_code"),
	material: varchar("material"),
	weight: integer("weight"),
	length: integer("length"),
	height: integer("height"),
	width: integer("width"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	variantRank: integer("variant_rank"),
},
(table) => {
	return {
		idx045D4A149C09F4704E0Bc08Dd4: uniqueIndex("IDX_045d4a149c09f4704e0bc08dd4").on(table.barcode),
		idx2Ca8Cfbdafb998Ecfd6D340389: uniqueIndex("IDX_2ca8cfbdafb998ecfd6d340389").on(table.sku),
		idxAa16F61348Be02Dd07Ce3Fc54E: uniqueIndex("IDX_aa16f61348be02dd07ce3fc54e").on(table.upc),
		idxB5B6225539Ee8501082Fbc0714: uniqueIndex("IDX_b5b6225539ee8501082fbc0714").on(table.ean),
		idxCa67Dd080Aac5Ecf99609960Cd: index("IDX_ca67dd080aac5ecf99609960cd").on(table.productId),
		idxGinProductVariantSku: index("idx_gin_product_variant_sku").on(table.sku),
		idxGinProductVariantTitle: index("idx_gin_product_variant_title").on(table.title),
	}
});

export const discountRule = pgTable("discount_rule", {
	id: varchar("id").primaryKey().notNull(),
	description: varchar("description"),
	type: discountRuleTypeEnum("type").notNull(),
	value: integer("value").notNull(),
	allocation: discountRuleAllocationEnum("allocation"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
});

export const note = pgTable("note", {
	id: varchar("id").primaryKey().notNull(),
	value: varchar("value").notNull(),
	resourceType: varchar("resource_type").notNull(),
	resourceId: varchar("resource_id").notNull(),
	authorId: varchar("author_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx3287F98Befad26C3A7Dab088Cf: index("IDX_3287f98befad26c3a7dab088cf").on(table.resourceId),
		idxF74980B411Cf94Af523A72Af7D: index("IDX_f74980b411cf94af523a72af7d").on(table.resourceType),
	}
});

export const invite = pgTable("invite", {
	id: varchar("id").primaryKey().notNull(),
	userEmail: varchar("user_email").notNull(),
	role: inviteRoleEnum("role").default('member'),
	accepted: boolean("accepted").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	token: varchar("token").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		idx6B0Ce4B4Bcfd24491510Bf19D1: uniqueIndex("IDX_6b0ce4b4bcfd24491510bf19d1").on(table.userEmail),
	}
});

export const taxProvider = pgTable("tax_provider", {
	id: varchar("id").primaryKey().notNull(),
	isInstalled: boolean("is_installed").default(true).notNull(),
});

export const returnReason = pgTable("return_reason", {
	id: varchar("id").primaryKey().notNull(),
	value: varchar("value").notNull(),
	label: varchar("label").notNull(),
	description: varchar("description"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	parentReturnReasonId: varchar("parent_return_reason_id"),
},
(table) => {
	return {
		idx00605F9D662C06B81C1B60Ce24: uniqueIndex("IDX_00605f9d662c06b81c1b60ce24").on(table.value),
		fk2250C5D9E975987Ab212F61A657: foreignKey({
			columns: [table.parentReturnReasonId],
			foreignColumns: [table.id]
		}),
	}
});

export const shippingOptionRequirement = pgTable("shipping_option_requirement", {
	id: varchar("id").primaryKey().notNull(),
	shippingOptionId: varchar("shipping_option_id").notNull().references(() => shippingOption.id),
	type: shippingOptionRequirementTypeEnum("type").notNull(),
	amount: integer("amount").notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		idx012A62Ba743E427B5Ebe9Dee18: index("IDX_012a62ba743e427b5ebe9dee18").on(table.shippingOptionId),
	}
});

export const claimOrder = pgTable("claim_order", {
	id: varchar("id").primaryKey().notNull(),
	paymentStatus: claimOrderPaymentStatusEnum("payment_status").default('na').notNull(),
	fulfillmentStatus: claimOrderFulfillmentStatusEnum("fulfillment_status").default('not_fulfilled').notNull(),
	type: claimOrderTypeEnum("type").notNull(),
	orderId: varchar("order_id").notNull().references(() => order.id),
	shippingAddressId: varchar("shipping_address_id").references(() => address.id),
	refundAmount: integer("refund_amount"),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	idempotencyKey: varchar("idempotency_key"),
	noNotification: boolean("no_notification"),
},
(table) => {
	return {
		idx017D58Bf8260C6E1A2588D258E: index("IDX_017d58bf8260c6e1a2588d258e").on(table.shippingAddressId),
		idxF49E3974465D3C3A33D449D3F3: index("IDX_f49e3974465d3c3a33d449d3f3").on(table.orderId),
	}
});

export const shippingMethod = pgTable("shipping_method", {
	id: varchar("id").primaryKey().notNull(),
	shippingOptionId: varchar("shipping_option_id").notNull().references(() => shippingOption.id),
	orderId: varchar("order_id").references(() => order.id),
	cartId: varchar("cart_id").references(() => cart.id),
	swapId: varchar("swap_id").references(() => swap.id),
	returnId: varchar("return_id").references(() => returns.id),
	price: integer("price").notNull(),
	data: jsonb("data").notNull(),
	claimOrderId: varchar("claim_order_id").references(() => claimOrder.id),
},
(table) => {
	return {
		idx1D9Ad62038998C3A85C77A53Cf: index("IDX_1d9ad62038998c3a85c77a53cf").on(table.returnId),
		idx5267705A43D547E232535B656C: index("IDX_5267705a43d547e232535b656c").on(table.orderId),
		idxD783A66D1C91C0858752C933E6: index("IDX_d783a66d1c91c0858752c933e6").on(table.claimOrderId),
		idxD92993A7D554D84571F4Eea1D1: index("IDX_d92993a7d554d84571f4eea1d1").on(table.cartId),
		idxFb94Fa8D5Ca940Daa2A58139F8: index("IDX_fb94fa8d5ca940daa2a58139f8").on(table.swapId),
		idxFc963E94854Bff2714Ca84Cd19: index("IDX_fc963e94854bff2714ca84cd19").on(table.shippingOptionId),
		rel1D9Ad62038998C3A85C77A53Cf: uniqueIndex("REL_1d9ad62038998c3a85c77a53cf").on(table.returnId),
	}
});

export const draftOrder = pgTable("draft_order", {
	id: varchar("id").primaryKey().notNull(),
	status: draftOrderStatusEnum("status").default('open').notNull(),
	displayId: serial("display_id").notNull(),
	cartId: varchar("cart_id").references(() => cart.id),
	orderId: varchar("order_id").references((): AnyPgColumn => order.id),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	idempotencyKey: varchar("idempotency_key"),
	noNotificationOrder: boolean("no_notification_order"),
},
(table) => {
	return {
		idx5Bd11D0E2A9628128E2C26Fd0A: index("IDX_5bd11d0e2a9628128e2c26fd0a").on(table.cartId),
		idx8F6Dd6C49202F1466Ebf21E77D: index("IDX_8f6dd6c49202f1466ebf21e77d").on(table.orderId),
		idxE87Cc617A22Ef4Edce5601Edab: index("IDX_e87cc617a22ef4edce5601edab").on(table.displayId),
		rel5Bd11D0E2A9628128E2C26Fd0A: uniqueIndex("REL_5bd11d0e2a9628128e2c26fd0a").on(table.cartId),
		rel8F6Dd6C49202F1466Ebf21E77D: uniqueIndex("REL_8f6dd6c49202f1466ebf21e77d").on(table.orderId),
	}
});

export const region = pgTable("region", {
	id: varchar("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	currencyCode: varchar("currency_code").notNull().references(() => currency.code),
	taxRate: real("tax_rate").notNull(),
	taxCode: varchar("tax_code"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	giftCardsTaxable: boolean("gift_cards_taxable").default(true).notNull(),
	automaticTaxes: boolean("automatic_taxes").default(true).notNull(),
	taxProviderId: varchar("tax_provider_id").references(() => taxProvider.id),
},
(table) => {
	return {
		idxRegionCurrencyCode: index("IDX_region_currency_code").on(table.currencyCode),
	}
});

export const customShippingOption = pgTable("custom_shipping_option", {
	id: varchar("id").primaryKey().notNull(),
	price: integer("price").notNull(),
	shippingOptionId: varchar("shipping_option_id").notNull().references(() => shippingOption.id),
	cartId: varchar("cart_id").references(() => cart.id),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx44090Cb11B06174Cbcc667E91C: index("IDX_44090cb11b06174cbcc667e91c").on(table.shippingOptionId),
		idx93Caeb1Bb70D37C1D36D6701A7: index("IDX_93caeb1bb70d37c1d36d6701a7").on(table.cartId),
		uq0F838B122A9A01D921Aa1Cdb669: uniqueIndex("UQ_0f838b122a9a01d921aa1cdb669").on(table.shippingOptionId, table.cartId),
	}
});

export const lineItemTaxLine = pgTable("line_item_tax_line", {
	id: varchar("id").primaryKey().notNull(),
	rate: real("rate").notNull(),
	name: varchar("name").notNull(),
	code: varchar("code"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
	itemId: varchar("item_id").notNull().references(() => lineItem.id),
},
(table) => {
	return {
		idx5077Fa54B0D037E984385Dfe8A: index("IDX_5077fa54b0d037e984385dfe8a").on(table.itemId),
		uq3C2Af51043Ed7243E7D9775A2Ad: uniqueIndex("UQ_3c2af51043ed7243e7d9775a2ad").on(table.code, table.itemId),
	}
});

export const taxRate = pgTable("tax_rate", {
	id: varchar("id").primaryKey().notNull(),
	rate: real("rate"),
	code: varchar("code"),
	name: varchar("name").notNull(),
	regionId: varchar("region_id").notNull().references(() => region.id),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
});

export const product = pgTable("product", {
	id: varchar("id").primaryKey().notNull(),
	title: varchar("title").notNull(),
	subtitle: varchar("subtitle"),
	description: varchar("description"),
	handle: varchar("handle"),
	isGiftcard: boolean("is_giftcard").notNull(),
	thumbnail: varchar("thumbnail"),
	profileId: varchar("profile_id").notNull().references(() => shippingProfile.id),
	weight: integer("weight"),
	length: integer("length"),
	height: integer("height"),
	width: integer("width"),
	hsCode: varchar("hs_code"),
	originCountry: varchar("origin_country"),
	midCode: varchar("mid_code"),
	material: varchar("material"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	collectionId: varchar("collection_id").references(() => productCollection.id),
	typeId: varchar("type_id").references(() => productType.id),
	discountable: boolean("discountable").default(true).notNull(),
	status: productStatusEnum("status").default('draft').notNull(),
	externalId: varchar("external_id"),
},
(table) => {
	return {
		idx80823B7Ae866Dc5Acae2Dac6D2: index("IDX_80823b7ae866dc5acae2dac6d2").on(table.profileId),
		idxCf9Cc6C3F2E6414B992223Fff1: uniqueIndex("IDX_cf9cc6c3f2e6414b992223fff1").on(table.handle),
		idxGinProductDescription: index("idx_gin_product_description").on(table.description),
		idxGinProductTitle: index("idx_gin_product_title").on(table.title),
	}
});

export const customerGroup = pgTable("customer_group", {
	id: varchar("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idxC4C3A5225A7A1F0Af782C40Abc: uniqueIndex("IDX_c4c3a5225a7a1f0af782c40abc").on(table.name),
	}
});

export const shippingMethodTaxLine = pgTable("shipping_method_tax_line", {
	id: varchar("id").primaryKey().notNull(),
	rate: real("rate").notNull(),
	name: varchar("name").notNull(),
	code: varchar("code"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
	shippingMethodId: varchar("shipping_method_id").notNull().references(() => shippingMethod.id),
},
(table) => {
	return {
		idx926Ca9F29014Af8091722Dede0: index("IDX_926ca9f29014af8091722dede0").on(table.shippingMethodId),
		uqCd147Fca71E50Bc954139Fa3104: uniqueIndex("UQ_cd147fca71e50bc954139fa3104").on(table.code, table.shippingMethodId),
	}
});

export const priceList = pgTable("price_list", {
	id: varchar("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	description: varchar("description").notNull(),
	type: priceListTypeEnum("type").default('sale').notNull(),
	status: priceListStatusEnum("status").default('draft').notNull(),
	startsAt: timestamp("starts_at", { withTimezone: true, mode: 'string' }),
	endsAt: timestamp("ends_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});

export const discountCondition = pgTable("discount_condition", {
	id: varchar("id").primaryKey().notNull(),
	type: discountConditionTypeEnum("type").notNull(),
	operator: discountConditionOperatorEnum("operator").notNull(),
	discountRuleId: varchar("discount_rule_id").notNull().references(() => discountRule.id),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idxEfff700651718E452Ca9580A62: index("IDX_efff700651718e452ca9580a62").on(table.discountRuleId),
		dctypeuniq: uniqueIndex("dctypeuniq").on(table.type, table.operator, table.discountRuleId),
	}
});

export const user = pgTable("user", {
	id: varchar("id").primaryKey().notNull(),
	email: varchar("email").notNull(),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
	passwordHash: varchar("password_hash"),
	apiToken: varchar("api_token"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	role: userRoleEnum("role").default('member'),
},
(table) => {
	return {
		idxBa8De19442D86957A3Aa3B5006: uniqueIndex("IDX_ba8de19442d86957a3aa3b5006").on(table.email),
	}
});

export const batchJob = pgTable("batch_job", {
	id: varchar("id").primaryKey().notNull(),
	type: text("type").notNull(),
	createdBy: varchar("created_by").references(() => user.id),
	context: jsonb("context"),
	result: jsonb("result"),
	dryRun: boolean("dry_run").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	preProcessedAt: timestamp("pre_processed_at", { withTimezone: true, mode: 'string' }),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: 'string' }),
	processingAt: timestamp("processing_at", { withTimezone: true, mode: 'string' }),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	failedAt: timestamp("failed_at", { withTimezone: true, mode: 'string' }),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});

export const giftCardTransaction = pgTable("gift_card_transaction", {
	id: varchar("id").primaryKey().notNull(),
	giftCardId: varchar("gift_card_id").notNull().references(() => giftCard.id),
	orderId: varchar("order_id").notNull().references(() => order.id),
	amount: integer("amount").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	isTaxable: boolean("is_taxable"),
	taxRate: real("tax_rate"),
},
(table) => {
	return {
		idxD7D441B81012F87D4265Fa57D2: index("IDX_d7d441b81012f87d4265fa57d2").on(table.orderId),
		gcuniq: uniqueIndex("gcuniq").on(table.giftCardId, table.orderId),
	}
});

export const moneyAmount = pgTable("money_amount", {
	id: varchar("id").primaryKey().notNull(),
	currencyCode: varchar("currency_code").notNull().references(() => currency.code),
	amount: integer("amount").notNull(),
	variantId: varchar("variant_id").references(() => productVariant.id, { onDelete: "cascade" } ),
	regionId: varchar("region_id").references(() => region.id),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	minQuantity: integer("min_quantity"),
	maxQuantity: integer("max_quantity"),
	priceListId: varchar("price_list_id").references(() => priceList.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idxMoneyAmountCurrencyCode: index("IDX_money_amount_currency_code").on(table.currencyCode),
		idxMoneyAmountRegionId: index("idx_money_amount_region_id").on(table.regionId),
		idxMoneyAmountVariantId: index("idx_money_amount_variant_id").on(table.variantId),
	}
});

export const swap = pgTable("swap", {
	id: varchar("id").primaryKey().notNull(),
	fulfillmentStatus: swapFulfillmentStatusEnum("fulfillment_status").notNull(),
	paymentStatus: swapPaymentStatusEnum("payment_status").notNull(),
	orderId: varchar("order_id").notNull().references(() => order.id),
	differenceDue: integer("difference_due"),
	shippingAddressId: varchar("shipping_address_id").references(() => address.id),
	cartId: varchar("cart_id").references(() => cart.id),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	idempotencyKey: varchar("idempotency_key"),
	noNotification: boolean("no_notification"),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }),
	allowBackorder: boolean("allow_backorder").notNull(),
},
(table) => {
	return {
		idx52Dd74E8C989Aa5665Ad2852B8: index("IDX_52dd74e8c989aa5665ad2852b8").on(table.orderId),
		rel402E8182Bc553E082F6380020B: uniqueIndex("REL_402e8182bc553e082f6380020b").on(table.cartId),
	}
});

export const analyticsConfig = pgTable("analytics_config", {
	id: varchar("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userId: varchar("user_id").notNull(),
	optOut: boolean("opt_out").notNull(),
	anonymize: boolean("anonymize").notNull(),
},
(table) => {
	return {
		idx379Ca70338Ce9991F3Affdeedf: uniqueIndex("IDX_379ca70338ce9991f3affdeedf").on(table.id, table.userId),
	}
});

export const cart = pgTable("cart", {
	id: varchar("id").primaryKey().notNull(),
	email: varchar("email"),
	billingAddressId: varchar("billing_address_id").references(() => address.id),
	shippingAddressId: varchar("shipping_address_id").references(() => address.id),
	regionId: varchar("region_id").notNull().references(() => region.id),
	customerId: varchar("customer_id").references(() => customer.id),
	paymentId: varchar("payment_id").references((): AnyPgColumn => payment.id),
	type: cartTypeEnum("type").default('default').notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	idempotencyKey: varchar("idempotency_key"),
	context: jsonb("context"),
	paymentAuthorizedAt: timestamp("payment_authorized_at", { withTimezone: true, mode: 'string' }),
	salesChannelId: varchar("sales_channel_id").references(() => salesChannel.id),
},
(table) => {
	return {
		idx242205C81C1152Fab1B6E84847: index("IDX_242205c81c1152fab1b6e84847").on(table.customerId),
		idx484C329F4783Be4E18E5E2Ff09: index("IDX_484c329f4783be4e18e5e2ff09").on(table.regionId),
		idx6B9C66B5E36F7C827Dfaa092F9: index("IDX_6b9c66b5e36f7c827dfaa092f9").on(table.billingAddressId),
		idx9D1A161434C610Aae7C3Df2Dc7: index("IDX_9d1a161434c610aae7c3df2dc7").on(table.paymentId),
		idxCed15A9A695D2B5Db9Dabce763: index("IDX_ced15a9a695d2b5db9dabce763").on(table.shippingAddressId),
		rel9D1A161434C610Aae7C3Df2Dc7: uniqueIndex("REL_9d1a161434c610aae7c3df2dc7").on(table.paymentId),
	}
});

export const orderItemChange = pgTable("order_item_change", {
	id: varchar("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	type: orderItemChangeTypeEnum("type").notNull(),
	orderEditId: varchar("order_edit_id").notNull().references(() => orderEdit.id),
	originalLineItemId: varchar("original_line_item_id").references(() => lineItem.id),
	lineItemId: varchar("line_item_id").references(() => lineItem.id),
},
(table) => {
	return {
		rel5F9688929761F7Df108B630E64: uniqueIndex("REL_5f9688929761f7df108b630e64").on(table.lineItemId),
		uq5B7A99181E4Db2Ea821Be0B6196: uniqueIndex("UQ_5b7a99181e4db2ea821be0b6196").on(table.orderEditId, table.originalLineItemId),
		uqDa93Cee3Ca0Dd50A5246268C2E9: uniqueIndex("UQ_da93cee3ca0dd50a5246268c2e9").on(table.orderEditId, table.lineItemId),
	}
});

export const publishableApiKey = pgTable("publishable_api_key", {
	id: varchar("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: varchar("created_by"),
	revokedBy: varchar("revoked_by"),
	revokedAt: timestamp("revoked_at", { withTimezone: true, mode: 'string' }),
	title: varchar("title").notNull(),
});

export const paymentCollection = pgTable("payment_collection", {
	id: varchar("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	type: paymentCollectionTypeEnum("type").notNull(),
	status: paymentCollectionStatusEnum("status").notNull(),
	description: text("description"),
	amount: integer("amount").notNull(),
	authorizedAmount: integer("authorized_amount"),
	regionId: varchar("region_id").notNull().references(() => region.id),
	currencyCode: varchar("currency_code").notNull(),
	metadata: jsonb("metadata"),
	createdBy: varchar("created_by").notNull(),
},
(table) => {
	return {
		idxPaymentCollectionCurrencyCode: index("IDX_payment_collection_currency_code").on(table.currencyCode),
		idxPaymentCollectionRegionId: index("IDX_payment_collection_region_id").on(table.regionId),
	}
});

export const productVariantInventoryItem = pgTable("product_variant_inventory_item", {
	id: varchar("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	inventoryItemId: text("inventory_item_id").notNull(),
	variantId: text("variant_id").notNull(),
	requiredQuantity: integer("required_quantity").default(1).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		idxProductVariantInventoryItemInventoryItemId: index("IDX_product_variant_inventory_item_inventory_item_id").on(table.inventoryItemId),
		idxProductVariantInventoryItemVariantId: index("IDX_product_variant_inventory_item_variant_id").on(table.variantId),
		uqC9Be7C1B11A1A729Eb51D1B6Bca: uniqueIndex("UQ_c9be7c1b11a1a729eb51d1b6bca").on(table.inventoryItemId, table.variantId),
	}
});

export const orderEdit = pgTable("order_edit", {
	id: varchar("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	orderId: varchar("order_id").notNull().references(() => order.id),
	internalNote: varchar("internal_note"),
	createdBy: varchar("created_by").notNull(),
	requestedBy: varchar("requested_by"),
	requestedAt: timestamp("requested_at", { withTimezone: true, mode: 'string' }),
	confirmedBy: varchar("confirmed_by"),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: 'string' }),
	declinedBy: varchar("declined_by"),
	declinedReason: varchar("declined_reason"),
	declinedAt: timestamp("declined_at", { withTimezone: true, mode: 'string' }),
	canceledBy: varchar("canceled_by"),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }),
	paymentCollectionId: varchar("payment_collection_id").references(() => paymentCollection.id),
},
(table) => {
	return {
		idxOrderEditOrderId: index("IDX_order_edit_order_id").on(table.orderId),
		idxOrderEditPaymentCollectionId: index("IDX_order_edit_payment_collection_id").on(table.paymentCollectionId),
	}
});

export const refund = pgTable("refund", {
	id: varchar("id").primaryKey().notNull(),
	orderId: varchar("order_id").references(() => order.id),
	amount: integer("amount").notNull(),
	note: varchar("note"),
	reason: refundReasonEnum("reason").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
	idempotencyKey: varchar("idempotency_key"),
	paymentId: varchar("payment_id").references(() => payment.id),
},
(table) => {
	return {
		idxEec9D9Af4Ca098E19Ea6B499Ea: index("IDX_eec9d9af4ca098e19ea6b499ea").on(table.orderId),
		idxRefundPaymentId: index("IDX_refund_payment_id").on(table.paymentId),
	}
});

export const productCategoryProduct = pgTable("product_category_product", {
	productCategoryId: varchar("product_category_id").notNull().references(() => productCategory.id, { onDelete: "cascade" } ),
	productId: varchar("product_id").notNull().references(() => product.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idxPcpProductCategoryId: index("IDX_pcp_product_category_id").on(table.productCategoryId),
		idxPcpProductId: index("IDX_pcp_product_id").on(table.productId),
		idxUpcpProductIdProductCategoryId: uniqueIndex("IDX_upcp_product_id_product_category_id").on(table.productCategoryId, table.productId),
	}
});

export const store = pgTable("store", {
	id: varchar("id").primaryKey().notNull(),
	name: varchar("name").default('Medusa Store').notNull(),
	defaultCurrencyCode: varchar("default_currency_code").default('usd').notNull().references(() => currency.code),
	swapLinkTemplate: varchar("swap_link_template"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
	paymentLinkTemplate: varchar("payment_link_template"),
	inviteLinkTemplate: varchar("invite_link_template"),
	defaultSalesChannelId: varchar("default_sales_channel_id").references(() => salesChannel.id),
	defaultLocationId: varchar("default_location_id"),
},
(table) => {
	return {
		uq61B0F48Cccbb5F41C750Bac7286: uniqueIndex("UQ_61b0f48cccbb5f41c750bac7286").on(table.defaultSalesChannelId),
	}
});

export const giftCard = pgTable("gift_card", {
	id: varchar("id").primaryKey().notNull(),
	code: varchar("code").notNull(),
	value: integer("value").notNull(),
	balance: integer("balance").notNull(),
	regionId: varchar("region_id").notNull().references(() => region.id),
	orderId: varchar("order_id").references(() => order.id),
	isDisabled: boolean("is_disabled").notNull(),
	endsAt: timestamp("ends_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb("metadata"),
	taxRate: real("tax_rate"),
},
(table) => {
	return {
		idx53Cb5605Fa42E82B4D47B47Bda: uniqueIndex("IDX_53cb5605fa42e82b4d47b47bda").on(table.code),
		idxB6Bcf8C3903097B84E85154Eed: index("IDX_b6bcf8c3903097b84e85154eed").on(table.regionId),
		idxDfc1F02Bb0552E79076Aa58Dbb: index("IDX_dfc1f02bb0552e79076aa58dbb").on(table.orderId),
	}
});

export const paymentSession = pgTable("payment_session", {
	id: varchar("id").primaryKey().notNull(),
	cartId: varchar("cart_id").references(() => cart.id),
	providerId: varchar("provider_id").notNull(),
	isSelected: boolean("is_selected"),
	status: paymentSessionStatusEnum("status").notNull(),
	data: jsonb("data").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	idempotencyKey: varchar("idempotency_key"),
	paymentAuthorizedAt: timestamp("payment_authorized_at", { withTimezone: true, mode: 'string' }),
	amount: integer("amount"),
	isInitiated: boolean("is_initiated").notNull(),
},
(table) => {
	return {
		idxD18Ad72F2Fb7C87F075825B6F8: index("IDX_d18ad72f2fb7c87f075825b6f8").on(table.providerId),
		idxD25Ba0787E1510Ddc5D442Ebcf: index("IDX_d25ba0787e1510ddc5d442ebcf").on(table.cartId),
		oneSelected: uniqueIndex("OneSelected").on(table.cartId, table.isSelected),
		uniqPaymentSessionCartIdProviderId: uniqueIndex("UniqPaymentSessionCartIdProviderId").on(table.cartId, table.providerId),
	}
});

export const lineItem = pgTable("line_item", {
	id: varchar("id").primaryKey().notNull(),
	cartId: varchar("cart_id").references(() => cart.id),
	orderId: varchar("order_id").references(() => order.id),
	swapId: varchar("swap_id").references(() => swap.id),
	title: varchar("title").notNull(),
	description: varchar("description"),
	thumbnail: varchar("thumbnail"),
	isGiftcard: boolean("is_giftcard").notNull(),
	shouldMerge: boolean("should_merge").default(true).notNull(),
	allowDiscounts: boolean("allow_discounts").default(true).notNull(),
	hasShipping: boolean("has_shipping"),
	unitPrice: integer("unit_price").notNull(),
	variantId: varchar("variant_id").references(() => productVariant.id),
	quantity: integer("quantity").notNull(),
	fulfilledQuantity: integer("fulfilled_quantity"),
	returnedQuantity: integer("returned_quantity"),
	shippedQuantity: integer("shipped_quantity"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
	claimOrderId: varchar("claim_order_id").references(() => claimOrder.id),
	isReturn: boolean("is_return").notNull(),
	originalItemId: varchar("original_item_id"),
	orderEditId: varchar("order_edit_id").references(() => orderEdit.id),
},
(table) => {
	return {
		idx118E3C48F09A7728F41023C94E: index("IDX_118e3c48f09a7728f41023c94e").on(table.claimOrderId),
		idx27283Ee631862266D0F1C68064: index("IDX_27283ee631862266d0f1c68064").on(table.cartId),
		idx3Fa354D8D1233Ff81097B2Fcb6: index("IDX_3fa354d8d1233ff81097b2fcb6").on(table.swapId),
		idx43A2B24495Fe1D9Fc2A9C835Bc: index("IDX_43a2b24495fe1d9fc2a9c835bc").on(table.orderId),
		idx5371Cbaa3Be5200F373D24E3D5: index("IDX_5371cbaa3be5200f373d24e3d5").on(table.variantId),
		uniqueLiOriginalItemIdOrderEditId: uniqueIndex("unique_li_original_item_id_order_edit_id").on(table.originalItemId, table.orderEditId),
		lineItemOriginalItemFk: foreignKey({
			columns: [table.originalItemId],
			foreignColumns: [table.id]
		}),
	}
});

export const returns = pgTable("return", {
	id: varchar("id").primaryKey().notNull(),
	status: returnStatusEnum("status").default('requested').notNull(),
	swapId: varchar("swap_id").references(() => swap.id),
	orderId: varchar("order_id").references(() => order.id),
	shippingData: jsonb("shipping_data"),
	refundAmount: integer("refund_amount").notNull(),
	receivedAt: timestamp("received_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
	idempotencyKey: varchar("idempotency_key"),
	claimOrderId: varchar("claim_order_id").references(() => claimOrder.id),
	noNotification: boolean("no_notification"),
	locationId: varchar("location_id"),
},
(table) => {
	return {
		idx71773D56Eb2Bacb922Bc328339: index("IDX_71773d56eb2bacb922bc328339").on(table.claimOrderId),
		idxBad82D7Bff2B08B87094Bfac3D: index("IDX_bad82d7bff2b08b87094bfac3d").on(table.swapId),
		idxD4Bd17F918Fc6C332B74A368C3: index("IDX_d4bd17f918fc6c332b74a368c3").on(table.orderId),
		relBad82D7Bff2B08B87094Bfac3D: uniqueIndex("REL_bad82d7bff2b08b87094bfac3d").on(table.swapId),
		uq71773D56Eb2Bacb922Bc3283398: uniqueIndex("UQ_71773d56eb2bacb922bc3283398").on(table.claimOrderId),
	}
});

export const stagedJob = pgTable("staged_job", {
	id: varchar("id").primaryKey().notNull(),
	eventName: varchar("event_name").notNull(),
	data: jsonb("data").notNull(),
	options: jsonb("options").default({}).notNull(),
});

export const order = pgTable("order", {
	id: varchar("id").primaryKey().notNull(),
	status: orderStatusEnum("status").default('pending').notNull(),
	fulfillmentStatus: orderFulfillmentStatusEnum("fulfillment_status").default('not_fulfilled').notNull(),
	paymentStatus: orderPaymentStatusEnum("payment_status").default('not_paid').notNull(),
	displayId: serial("display_id").notNull(),
	cartId: varchar("cart_id").references(() => cart.id),
	customerId: varchar("customer_id").notNull().references(() => customer.id),
	email: varchar("email").notNull(),
	billingAddressId: varchar("billing_address_id").references(() => address.id),
	shippingAddressId: varchar("shipping_address_id").references(() => address.id),
	regionId: varchar("region_id").notNull().references(() => region.id),
	currencyCode: varchar("currency_code").notNull().references(() => currency.code),
	taxRate: real("tax_rate"),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
	idempotencyKey: varchar("idempotency_key"),
	draftOrderId: varchar("draft_order_id").references((): AnyPgColumn => draftOrder.id),
	noNotification: boolean("no_notification"),
	externalId: varchar("external_id"),
	salesChannelId: varchar("sales_channel_id").references(() => salesChannel.id),
},
(table) => {
	return {
		idx19B0C6293443D1B464F604C331: index("IDX_19b0c6293443d1b464f604c331").on(table.shippingAddressId),
		idx5568D3B9Ce9F7Abeeb37511Ecf: index("IDX_5568d3b9ce9f7abeeb37511ecf").on(table.billingAddressId),
		idx579E01Fb94F4F58Db480857E05: index("IDX_579e01fb94f4f58db480857e05").on(table.displayId),
		idxC99A206Eb11Ad45F6B7F04F2Dc: index("IDX_c99a206eb11ad45f6b7f04f2dc").on(table.cartId),
		idxCd7812C96209C5Bdd48A6B858B: index("IDX_cd7812c96209c5bdd48a6b858b").on(table.customerId),
		idxE1Fcce2B18Dbcdbe0A5Ba9A68B: index("IDX_e1fcce2b18dbcdbe0a5ba9a68b").on(table.regionId),
		idxOrderCurrencyCode: index("IDX_order_currency_code").on(table.currencyCode),
		relC99A206Eb11Ad45F6B7F04F2Dc: uniqueIndex("REL_c99a206eb11ad45f6b7f04f2dc").on(table.cartId),
		uq727B872F86C7378474A8Fa46147: uniqueIndex("UQ_727b872f86c7378474a8fa46147").on(table.draftOrderId),
	}
});

export const productCategory = pgTable("product_category", {
	id: varchar("id").primaryKey().notNull(),
	name: text("name").notNull(),
	handle: text("handle").notNull(),
	parentCategoryId: varchar("parent_category_id"),
	mpath: text("mpath"),
	isActive: boolean("is_active"),
	isInternal: boolean("is_internal"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	rank: integer("rank").notNull(),
	description: text("description").default('').notNull(),
},
(table) => {
	return {
		idxProductCategoryActivePublic: index("IDX_product_category_active_public").on(table.parentCategoryId, table.isInternal, table.isActive),
		idxProductCategoryHandle: uniqueIndex("IDX_product_category_handle").on(table.handle),
		idxProductCategoryPath: index("IDX_product_category_path").on(table.mpath),
		uniqProductCategoryParentIdRank: uniqueIndex("UniqProductCategoryParentIdRank").on(table.rank, table.parentCategoryId),
	}
});

export const salesChannel = pgTable("sales_channel", {
	id: varchar("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	name: varchar("name").notNull(),
	description: varchar("description"),
	isDisabled: boolean("is_disabled").notNull(),
	metadata: jsonb("metadata"),
});

export const salesChannelLocation = pgTable("sales_channel_location", {
	id: varchar("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	salesChannelId: text("sales_channel_id").notNull(),
	locationId: text("location_id").notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		idxSalesChannelLocationLocationId: index("IDX_sales_channel_location_location_id").on(table.locationId),
		idxSalesChannelLocationSalesChannelId: index("IDX_sales_channel_location_sales_channel_id").on(table.salesChannelId),
	}
});

export const lineItemAdjustment = pgTable("line_item_adjustment", {
	id: varchar("id").primaryKey().notNull(),
	itemId: varchar("item_id").notNull().references(() => lineItem.id, { onDelete: "cascade" } ),
	description: varchar("description").notNull(),
	discountId: varchar("discount_id").references(() => discount.id),
	amount: numeric("amount").notNull(),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx2F41B20A71F30E60471D7E3769: index("IDX_2f41b20a71f30e60471d7e3769").on(table.discountId),
		idxBe9Aea2Ccf3567007B6227Da4D: index("IDX_be9aea2ccf3567007b6227da4d").on(table.itemId),
		idxBf701B88D2041392A288785Ada: uniqueIndex("IDX_bf701b88d2041392a288785ada").on(table.itemId, table.discountId),
	}
});

export const fulfillment = pgTable("fulfillment", {
	id: varchar("id").primaryKey().notNull(),
	swapId: varchar("swap_id").references(() => swap.id),
	orderId: varchar("order_id").references(() => order.id),
	trackingNumbers: jsonb("tracking_numbers").default([]).notNull(),
	data: jsonb("data").notNull(),
	shippedAt: timestamp("shipped_at", { withTimezone: true, mode: 'string' }),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
	idempotencyKey: varchar("idempotency_key"),
	providerId: varchar("provider_id").references(() => fulfillmentProvider.id),
	claimOrderId: varchar("claim_order_id").references(() => claimOrder.id),
	noNotification: boolean("no_notification"),
	locationId: varchar("location_id"),
},
(table) => {
	return {
		idxA52E234F729Db789Cf473297A5: index("IDX_a52e234f729db789cf473297a5").on(table.swapId),
		idxBeb35A6De60A6C4F91D5Ae57E4: index("IDX_beb35a6de60a6c4f91d5ae57e4").on(table.providerId),
		idxD73E55964E0Ff2Db8F03807D52: index("IDX_d73e55964e0ff2db8f03807d52").on(table.claimOrderId),
		idxF129Acc85E346A10Eed12B86Fc: index("IDX_f129acc85e346a10eed12b86fc").on(table.orderId),
	}
});

export const regionFulfillmentProviders = pgTable("region_fulfillment_providers", {
	regionId: varchar("region_id").notNull().references(() => region.id, { onDelete: "cascade" } ),
	providerId: varchar("provider_id").notNull().references(() => fulfillmentProvider.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx37F361C38A18D12A3Fa3158D0C: index("IDX_37f361c38a18d12a3fa3158d0c").on(table.providerId),
		idxC556E14Eff4D6F03Db593Df955: index("IDX_c556e14eff4d6f03db593df955").on(table.regionId),
		pk5B7D928A1Fb50D6803868Cfab3A: primaryKey(table.regionId, table.providerId)
	}
});

export const storeCurrencies = pgTable("store_currencies", {
	storeId: varchar("store_id").notNull().references(() => store.id, { onDelete: "cascade" } ),
	currencyCode: varchar("currency_code").notNull().references(() => currency.code, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx82A6Bbb0B527C20A0002Ddcbd6: index("IDX_82a6bbb0b527c20a0002ddcbd6").on(table.currencyCode),
		idxB4F4B63D1736689B7008980394: index("IDX_b4f4b63d1736689b7008980394").on(table.storeId),
		pk0F2Bff3Bccc785C320A4Df836De: primaryKey(table.storeId, table.currencyCode)
	}
});

export const orderGiftCards = pgTable("order_gift_cards", {
	orderId: varchar("order_id").notNull().references(() => order.id, { onDelete: "cascade" } ),
	giftCardId: varchar("gift_card_id").notNull().references(() => giftCard.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idxE62Ff11E4730Bb3Adfead979Ee: index("IDX_e62ff11e4730bb3adfead979ee").on(table.orderId),
		idxF2Bb9F71E95B315Eb24B2B84Cb: index("IDX_f2bb9f71e95b315eb24b2b84cb").on(table.giftCardId),
		pk49A8Ec66A6625D7C2E3526E05B4: primaryKey(table.orderId, table.giftCardId)
	}
});

export const orderDiscounts = pgTable("order_discounts", {
	orderId: varchar("order_id").notNull().references(() => order.id, { onDelete: "cascade" } ),
	discountId: varchar("discount_id").notNull().references(() => discount.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx0Fc1Ec4E3Db9001Ad60C19Daf1: index("IDX_0fc1ec4e3db9001ad60c19daf1").on(table.discountId),
		idxE7B488Cebe333F449398769B2C: index("IDX_e7b488cebe333f449398769b2c").on(table.orderId),
		pkA7418714Ffceebc125Bf6D8Fcfe: primaryKey(table.orderId, table.discountId)
	}
});

export const discountRuleProducts = pgTable("discount_rule_products", {
	discountRuleId: varchar("discount_rule_id").notNull().references(() => discountRule.id, { onDelete: "cascade" } ),
	productId: varchar("product_id").notNull().references(() => product.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx4E0739E5F0244C08D41174Ca08: index("IDX_4e0739e5f0244c08d41174ca08").on(table.discountRuleId),
		idxBe66106A673B88A81C603Abe7E: index("IDX_be66106a673b88a81c603abe7e").on(table.productId),
		pk351C8C92F5D27283C445Cd022Ee: primaryKey(table.discountRuleId, table.productId)
	}
});

export const discountRegions = pgTable("discount_regions", {
	discountId: varchar("discount_id").notNull().references(() => discount.id, { onDelete: "cascade" } ),
	regionId: varchar("region_id").notNull().references(() => region.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idxA21A7Ffbe420D492Eb46C305Fe: index("IDX_a21a7ffbe420d492eb46c305fe").on(table.regionId),
		idxF4194Aa81073F3Fab8Aa86906F: index("IDX_f4194aa81073f3fab8aa86906f").on(table.discountId),
		pk15974566A8B6E04A7C754E85B75: primaryKey(table.discountId, table.regionId)
	}
});

export const productImages = pgTable("product_images", {
	productId: varchar("product_id").notNull().references(() => product.id, { onDelete: "cascade" } ),
	imageId: varchar("image_id").notNull().references(() => image.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx2212515Ba306C79F42C46A99Db: index("IDX_2212515ba306c79f42c46a99db").on(table.imageId),
		idx4F166Bb8C2Bfcef2498D97B406: index("IDX_4f166bb8c2bfcef2498d97b406").on(table.productId),
		pk10De97980Da2E939C4C0E8423F2: primaryKey(table.productId, table.imageId)
	}
});

export const cartDiscounts = pgTable("cart_discounts", {
	cartId: varchar("cart_id").notNull().references(() => cart.id, { onDelete: "cascade" } ),
	discountId: varchar("discount_id").notNull().references(() => discount.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx6680319Ebe1F46D18F106191D5: index("IDX_6680319ebe1f46d18f106191d5").on(table.cartId),
		idx8Df75Ef4F35F217768Dc113545: index("IDX_8df75ef4f35f217768dc113545").on(table.discountId),
		pk10Bd412C9071Ccc0Cf555Afd9Bb: primaryKey(table.cartId, table.discountId)
	}
});

export const regionPaymentProviders = pgTable("region_payment_providers", {
	regionId: varchar("region_id").notNull().references(() => region.id, { onDelete: "cascade" } ),
	providerId: varchar("provider_id").notNull().references(() => paymentProvider.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx3A6947180Aeec283Cd92C59Ebb: index("IDX_3a6947180aeec283cd92c59ebb").on(table.providerId),
		idx8Aaa78Ba90D3802Edac317Df86: index("IDX_8aaa78ba90d3802edac317df86").on(table.regionId),
		pk9Fa1E69914D3Dd752De6B1Da407: primaryKey(table.regionId, table.providerId)
	}
});

export const productTags = pgTable("product_tags", {
	productId: varchar("product_id").notNull().references(() => product.id, { onDelete: "cascade" } ),
	productTagId: varchar("product_tag_id").notNull().references(() => productTag.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx21683A063Fe82Dafdf681Ecc9C: index("IDX_21683a063fe82dafdf681ecc9c").on(table.productTagId),
		idx5B0C6Fc53C574299Ecc7F9Ee22: index("IDX_5b0c6fc53c574299ecc7f9ee22").on(table.productId),
		pk1Cf5C9537E7198Df494B71B993F: primaryKey(table.productId, table.productTagId)
	}
});

export const cartGiftCards = pgTable("cart_gift_cards", {
	cartId: varchar("cart_id").notNull().references(() => cart.id, { onDelete: "cascade" } ),
	giftCardId: varchar("gift_card_id").notNull().references(() => giftCard.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx0Fb38B6D167793192Bc126D835: index("IDX_0fb38b6d167793192bc126d835").on(table.giftCardId),
		idxD38047A90F3D42F0Be7909E8Ae: index("IDX_d38047a90f3d42f0be7909e8ae").on(table.cartId),
		pk2389Be82Bf0Ef3635E2014C9Ef1: primaryKey(table.cartId, table.giftCardId)
	}
});

export const claimItemTags = pgTable("claim_item_tags", {
	itemId: varchar("item_id").notNull().references(() => claimItem.id, { onDelete: "cascade" } ),
	tagId: varchar("tag_id").notNull().references(() => claimTag.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idxC2C0F3Edf39515Bd15432Afe6E: index("IDX_c2c0f3edf39515bd15432afe6e").on(table.itemId),
		idxDc9Bbf9Fcb9Ba458D25D512811: index("IDX_dc9bbf9fcb9ba458d25d512811").on(table.tagId),
		pk54Ab8Ce0F7E99167068188Fbd81: primaryKey(table.itemId, table.tagId)
	}
});

export const customerGroupCustomers = pgTable("customer_group_customers", {
	customerGroupId: varchar("customer_group_id").notNull().references(() => customerGroup.id, { onDelete: "cascade" } ),
	customerId: varchar("customer_id").notNull().references(() => customer.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx3C6412D076292F439269Abe1A2: index("IDX_3c6412d076292f439269abe1a2").on(table.customerId),
		idx620330964Db8D2999E67B0Dbe3: index("IDX_620330964db8d2999e67b0dbe3").on(table.customerGroupId),
		pkE28A55E34Ad1E2D3Df9A0Ac86D3: primaryKey(table.customerGroupId, table.customerId)
	}
});

export const priceListCustomerGroups = pgTable("price_list_customer_groups", {
	priceListId: varchar("price_list_id").notNull().references(() => priceList.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	customerGroupId: varchar("customer_group_id").notNull().references(() => customerGroup.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idx52875734E9Dd69064F0041F4D9: index("IDX_52875734e9dd69064f0041f4d9").on(table.priceListId),
		idxC5516F550433C9B1C2630D787A: index("IDX_c5516f550433c9b1c2630d787a").on(table.customerGroupId),
		pk1Afcbe15Cc8782Dc80C05707Df9: primaryKey(table.priceListId, table.customerGroupId)
	}
});

export const paymentCollectionSessions = pgTable("payment_collection_sessions", {
	paymentCollectionId: varchar("payment_collection_id").notNull().references(() => paymentCollection.id, { onDelete: "cascade" } ),
	paymentSessionId: varchar("payment_session_id").notNull().references(() => paymentSession.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idxPaymentCollectionSessionsPaymentCollectionId: index("IDX_payment_collection_sessions_payment_collection_id").on(table.paymentCollectionId),
		idxPaymentCollectionSessionsPaymentSessionId: index("IDX_payment_collection_sessions_payment_session_id").on(table.paymentSessionId),
		pkPaymentCollectionSessions: primaryKey(table.paymentCollectionId, table.paymentSessionId)
	}
});

export const productSalesChannel = pgTable("product_sales_channel", {
	productId: varchar("product_id").notNull().references(() => product.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	salesChannelId: varchar("sales_channel_id").notNull().references(() => salesChannel.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		idx37341Bad297Fe5Cca91F921032: index("IDX_37341bad297fe5cca91f921032").on(table.salesChannelId),
		idx5A4D5E1E60F97633547821Ec8D: index("IDX_5a4d5e1e60f97633547821ec8d").on(table.productId),
		pkFd29B6A8Bd641052628Dee19583: primaryKey(table.productId, table.salesChannelId)
	}
});

export const paymentCollectionPayments = pgTable("payment_collection_payments", {
	paymentCollectionId: varchar("payment_collection_id").notNull().references(() => paymentCollection.id, { onDelete: "cascade" } ),
	paymentId: varchar("payment_id").notNull().references(() => payment.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		idxPaymentCollectionPaymentsPaymentCollectionId: index("IDX_payment_collection_payments_payment_collection_id").on(table.paymentCollectionId),
		idxPaymentCollectionPaymentsPaymentId: index("IDX_payment_collection_payments_payment_id").on(table.paymentId),
		pkPaymentCollectionPayments: primaryKey(table.paymentCollectionId, table.paymentId)
	}
});

export const publishableApiKeySalesChannel = pgTable("publishable_api_key_sales_channel", {
	salesChannelId: varchar("sales_channel_id").notNull(),
	publishableKeyId: varchar("publishable_key_id").notNull(),
},
(table) => {
	return {
		pk68Eaeb14Bdac8954460054C567C: primaryKey(table.salesChannelId, table.publishableKeyId)
	}
});

export const fulfillmentItem = pgTable("fulfillment_item", {
	fulfillmentId: varchar("fulfillment_id").notNull().references(() => fulfillment.id),
	itemId: varchar("item_id").notNull().references(() => lineItem.id),
	quantity: integer("quantity").notNull(),
},
(table) => {
	return {
		pkBc3E8A388De75Db146A249922E0: primaryKey(table.fulfillmentId, table.itemId)
	}
});

export const productTypeTaxRate = pgTable("product_type_tax_rate", {
	productTypeId: varchar("product_type_id").notNull().references(() => productType.id, { onDelete: "cascade" } ),
	rateId: varchar("rate_id").notNull().references(() => taxRate.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx25A3138Bb236F63D9Bb6C8Ff11: index("IDX_25a3138bb236f63d9bb6c8ff11").on(table.productTypeId),
		idxEce65A774192B34253Abc4Cd67: index("IDX_ece65a774192b34253abc4cd67").on(table.rateId),
		pkDdc9242De1D99Bc7674969289F0: primaryKey(table.productTypeId, table.rateId)
	}
});

export const productTaxRate = pgTable("product_tax_rate", {
	productId: varchar("product_id").notNull().references(() => product.id, { onDelete: "cascade" } ),
	rateId: varchar("rate_id").notNull().references(() => taxRate.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx1D04Aebeabb6A89F87E536A124: index("IDX_1d04aebeabb6a89f87e536a124").on(table.productId),
		idx2484Cf14C437A04586B07E7Ddd: index("IDX_2484cf14c437a04586b07e7ddd").on(table.rateId),
		pk326257Ce468Df46Cd5C8C5922E9: primaryKey(table.productId, table.rateId)
	}
});

export const shippingTaxRate = pgTable("shipping_tax_rate", {
	shippingOptionId: varchar("shipping_option_id").notNull().references(() => shippingOption.id, { onDelete: "cascade" } ),
	rateId: varchar("rate_id").notNull().references(() => taxRate.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx346E0016Cf045B998074774764: index("IDX_346e0016cf045b998074774764").on(table.rateId),
		idxF672727Ab020Df6C50Fb64C1A7: index("IDX_f672727ab020df6c50fb64c1a7").on(table.shippingOptionId),
		pkBcd93B14D7E2695365D383F5Eae: primaryKey(table.shippingOptionId, table.rateId)
	}
});

export const discountConditionProductTag = pgTable("discount_condition_product_tag", {
	productTagId: varchar("product_tag_id").notNull().references(() => productTag.id, { onDelete: "cascade" } ),
	conditionId: varchar("condition_id").notNull().references(() => discountCondition.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx01486Cc9Dc6B36Bf658685535F: index("IDX_01486cc9dc6b36bf658685535f").on(table.productTagId),
		idxFbb2499551Ed074526F3Ee3624: index("IDX_fbb2499551ed074526f3ee3624").on(table.conditionId),
		pkA95382C1E62205B121Aa058682B: primaryKey(table.productTagId, table.conditionId)
	}
});

export const discountConditionProduct = pgTable("discount_condition_product", {
	productId: varchar("product_id").notNull().references(() => product.id, { onDelete: "cascade" } ),
	conditionId: varchar("condition_id").notNull().references(() => discountCondition.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idxC759F53B2E48E8Cfb50638Fe4E: index("IDX_c759f53b2e48e8cfb50638fe4e").on(table.productId),
		idxF05132301E95Bdab4Ba1Cf29A2: index("IDX_f05132301e95bdab4ba1cf29a2").on(table.conditionId),
		pk994Eb4529Fdbf14450D64Ec17E8: primaryKey(table.productId, table.conditionId)
	}
});

export const discountConditionCustomerGroup = pgTable("discount_condition_customer_group", {
	customerGroupId: varchar("customer_group_id").notNull().references(() => customerGroup.id, { onDelete: "cascade" } ),
	conditionId: varchar("condition_id").notNull().references(() => discountCondition.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx4D5F98645A67545D8Dea42E2Eb: index("IDX_4d5f98645a67545d8dea42e2eb").on(table.customerGroupId),
		idx8486Ee16E69013C645D0B8716B: index("IDX_8486ee16e69013c645d0b8716b").on(table.conditionId),
		pkCdc8B2277169A16B8B7D4C73E0E: primaryKey(table.customerGroupId, table.conditionId)
	}
});

export const discountConditionProductType = pgTable("discount_condition_product_type", {
	productTypeId: varchar("product_type_id").notNull().references(() => productType.id, { onDelete: "cascade" } ),
	conditionId: varchar("condition_id").notNull().references(() => discountCondition.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idx6Ef23Ce0B1D9Cf9B5B833E52B9: index("IDX_6ef23ce0b1d9cf9b5b833e52b9").on(table.conditionId),
		idxE706Deb68F52Ab2756119B9E70: index("IDX_e706deb68f52ab2756119b9e70").on(table.productTypeId),
		pk35D538A5A24399D0Df978Df12Ed: primaryKey(table.productTypeId, table.conditionId)
	}
});

export const discountConditionProductCollection = pgTable("discount_condition_product_collection", {
	productCollectionId: varchar("product_collection_id").notNull().references(() => productCollection.id, { onDelete: "cascade" } ),
	conditionId: varchar("condition_id").notNull().references(() => discountCondition.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		idxA0B05Dc4257Abe639Cb75F8Eae: index("IDX_a0b05dc4257abe639cb75f8eae").on(table.productCollectionId),
		idxA1C4F9Cfb599Ad1F0Db39Cadd5: index("IDX_a1c4f9cfb599ad1f0db39cadd5").on(table.conditionId),
		pkB3508Fc787Aa4A38705866Cbb6D: primaryKey(table.productCollectionId, table.conditionId)
	}
});

export const returnItem = pgTable("return_item", {
	returnId: varchar("return_id").notNull().references(() => returns.id),
	itemId: varchar("item_id").notNull().references(() => lineItem.id),
	quantity: integer("quantity").notNull(),
	isRequested: boolean("is_requested").default(true).notNull(),
	requestedQuantity: integer("requested_quantity"),
	receivedQuantity: integer("received_quantity"),
	metadata: jsonb("metadata"),
	reasonId: varchar("reason_id").references(() => returnReason.id),
	note: varchar("note"),
},
(table) => {
	return {
		pk46409Dc1Dd5F38509B9000C3069: primaryKey(table.returnId, table.itemId)
	}
});

