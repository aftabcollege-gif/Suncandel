CREATE TYPE "public"."ai_inference_type" AS ENUM('customer_assistant', 'vendor_copilot', 'recommendation', 'search', 'social_message', 'automation', 'analytics');--> statement-breakpoint
CREATE TYPE "public"."ai_model_status" AS ENUM('active', 'inactive', 'deprecated');--> statement-breakpoint
CREATE TYPE "public"."automation_run_status" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "ai_evaluation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"evaluation_type" varchar(64) NOT NULL,
	"metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_inferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"actor_user_id" uuid,
	"model_registry_id" uuid,
	"inference_type" "ai_inference_type" NOT NULL,
	"input_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"output_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"explainability" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"latency_ms" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_model_registry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"model_key" varchar(128) NOT NULL,
	"provider" varchar(128) NOT NULL,
	"version" varchar(64) NOT NULL,
	"status" "ai_model_status" DEFAULT 'active' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_pipeline_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"job_type" varchar(64) NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "automation_run_status" DEFAULT 'pending' NOT NULL,
	"result" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_recommendation_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"customer_id" uuid,
	"context_type" varchar(64) NOT NULL,
	"context_ref_id" uuid,
	"recommendations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_search_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"actor_user_id" uuid,
	"query" text NOT NULL,
	"normalized_query" text NOT NULL,
	"filters" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"results_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_intelligence_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"preference_profile" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"interest_profile" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"buying_pattern" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"segment" varchar(128) DEFAULT 'new' NOT NULL,
	"ai_consent" boolean DEFAULT false NOT NULL,
	"last_computed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instagram_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"store_id" uuid,
	"instagram_business_id" varchar(128) NOT NULL,
	"access_token_hash" text NOT NULL,
	"status" varchar(32) DEFAULT 'connected' NOT NULL,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instagram_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"connection_id" uuid NOT NULL,
	"sender_handle" varchar(255) NOT NULL,
	"message_text" text NOT NULL,
	"intent" varchar(64),
	"extracted_entities" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"suggested_products" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"order_intent" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketing_automation_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"trigger_type" varchar(64) NOT NULL,
	"target_channel" varchar(64) NOT NULL,
	"condition_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"action_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketing_automation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"rule_id" uuid NOT NULL,
	"customer_id" uuid,
	"status" "automation_run_status" DEFAULT 'pending' NOT NULL,
	"output" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"run_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_evaluation_runs" ADD CONSTRAINT "ai_evaluation_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_inferences" ADD CONSTRAINT "ai_inferences_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_inferences" ADD CONSTRAINT "ai_inferences_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_inferences" ADD CONSTRAINT "ai_inferences_model_registry_id_ai_model_registry_id_fk" FOREIGN KEY ("model_registry_id") REFERENCES "public"."ai_model_registry"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_model_registry" ADD CONSTRAINT "ai_model_registry_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_pipeline_jobs" ADD CONSTRAINT "ai_pipeline_jobs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_recommendation_snapshots" ADD CONSTRAINT "ai_recommendation_snapshots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_recommendation_snapshots" ADD CONSTRAINT "ai_recommendation_snapshots_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_search_logs" ADD CONSTRAINT "ai_search_logs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_search_logs" ADD CONSTRAINT "ai_search_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_intelligence_profiles" ADD CONSTRAINT "customer_intelligence_profiles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_intelligence_profiles" ADD CONSTRAINT "customer_intelligence_profiles_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD CONSTRAINT "instagram_connections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD CONSTRAINT "instagram_connections_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD CONSTRAINT "instagram_connections_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instagram_messages" ADD CONSTRAINT "instagram_messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instagram_messages" ADD CONSTRAINT "instagram_messages_connection_id_instagram_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."instagram_connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_automation_rules" ADD CONSTRAINT "marketing_automation_rules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_automation_runs" ADD CONSTRAINT "marketing_automation_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_automation_runs" ADD CONSTRAINT "marketing_automation_runs_rule_id_marketing_automation_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."marketing_automation_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_automation_runs" ADD CONSTRAINT "marketing_automation_runs_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_evaluation_runs_tenant_type_idx" ON "ai_evaluation_runs" USING btree ("tenant_id","evaluation_type");--> statement-breakpoint
CREATE INDEX "ai_inferences_tenant_type_idx" ON "ai_inferences" USING btree ("tenant_id","inference_type");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_model_registry_tenant_key_version_unique" ON "ai_model_registry" USING btree ("tenant_id","model_key","version");--> statement-breakpoint
CREATE INDEX "ai_pipeline_jobs_tenant_job_idx" ON "ai_pipeline_jobs" USING btree ("tenant_id","job_type");--> statement-breakpoint
CREATE INDEX "ai_recommendations_tenant_context_idx" ON "ai_recommendation_snapshots" USING btree ("tenant_id","context_type");--> statement-breakpoint
CREATE INDEX "ai_search_logs_tenant_query_idx" ON "ai_search_logs" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "customer_intelligence_customer_unique" ON "customer_intelligence_profiles" USING btree ("customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "instagram_connections_vendor_business_unique" ON "instagram_connections" USING btree ("vendor_id","instagram_business_id");--> statement-breakpoint
CREATE INDEX "instagram_messages_tenant_connection_idx" ON "instagram_messages" USING btree ("tenant_id","connection_id");--> statement-breakpoint
CREATE INDEX "marketing_rules_tenant_trigger_idx" ON "marketing_automation_rules" USING btree ("tenant_id","trigger_type");--> statement-breakpoint
CREATE INDEX "marketing_runs_tenant_status_idx" ON "marketing_automation_runs" USING btree ("tenant_id","status");