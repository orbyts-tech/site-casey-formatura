import "server-only";
import { z } from "zod";
import { assertNoSupabaseError, getSupabaseServiceClient } from "@/infrastructure/supabase/service-client";
import {
  GREETING_PREFIXES,
  INVITATION_RSVP_STATUSES,
  type InvitationRecord,
  type InvitationRepository,
  type InvitationRsvpAnswer,
  type NewInvitationRecord,
} from "../domain/invitation-record";

const INVITATIONS_TABLE = "invitations";
const INVITATION_COLUMNS = "id, token, greeting_prefix, greeting_name, guest_names, rsvp_status, responded_at, opened_at, created_at";

const invitationRowSchema = z
  .object({
    id: z.string(),
    token: z.string(),
    greeting_prefix: z.enum(GREETING_PREFIXES),
    greeting_name: z.string(),
    guest_names: z.array(z.string()),
    rsvp_status: z.enum(INVITATION_RSVP_STATUSES),
    responded_at: z.string().nullable(),
    opened_at: z.string().nullable(),
    created_at: z.string(),
  })
  .transform(
    (row): InvitationRecord => ({
      id: row.id,
      token: row.token,
      greetingPrefix: row.greeting_prefix,
      greetingName: row.greeting_name,
      guestNames: row.guest_names,
      rsvpStatus: row.rsvp_status,
      respondedAt: row.responded_at,
      openedAt: row.opened_at,
      createdAt: row.created_at,
    }),
  );

export class SupabaseInvitationRepository implements InvitationRepository {
  private readonly client = getSupabaseServiceClient();

  async create(invitation: NewInvitationRecord): Promise<InvitationRecord> {
    const { data, error } = await this.client
      .from(INVITATIONS_TABLE)
      .insert({
        id: invitation.id,
        token: invitation.token,
        greeting_prefix: invitation.greetingPrefix,
        greeting_name: invitation.greetingName,
        guest_names: invitation.guestNames,
      })
      .select(INVITATION_COLUMNS)
      .single();

    assertNoSupabaseError(error, "Falha ao criar convite");
    return invitationRowSchema.parse(data);
  }

  async listAll(): Promise<readonly InvitationRecord[]> {
    const { data, error } = await this.client
      .from(INVITATIONS_TABLE)
      .select(INVITATION_COLUMNS)
      .order("created_at", { ascending: false });

    assertNoSupabaseError(error, "Falha ao listar convites");
    return z.array(invitationRowSchema).parse(data ?? []);
  }

  async findByToken(token: string): Promise<InvitationRecord | null> {
    const { data, error } = await this.client
      .from(INVITATIONS_TABLE)
      .select(INVITATION_COLUMNS)
      .eq("token", token)
      .maybeSingle();

    assertNoSupabaseError(error, "Falha ao buscar convite");
    return data ? invitationRowSchema.parse(data) : null;
  }

  async findById(id: string): Promise<InvitationRecord | null> {
    const { data, error } = await this.client.from(INVITATIONS_TABLE).select(INVITATION_COLUMNS).eq("id", id).maybeSingle();

    assertNoSupabaseError(error, "Falha ao buscar convite");
    return data ? invitationRowSchema.parse(data) : null;
  }

  async updateRsvpStatus(id: string, status: InvitationRsvpAnswer, respondedAt: string): Promise<void> {
    const { error } = await this.client
      .from(INVITATIONS_TABLE)
      .update({ rsvp_status: status, responded_at: respondedAt })
      .eq("id", id);

    assertNoSupabaseError(error, "Falha ao registrar resposta do convite");
  }

  async markOpened(id: string, openedAt: string): Promise<void> {
    const { error } = await this.client
      .from(INVITATIONS_TABLE)
      .update({ opened_at: openedAt })
      .eq("id", id)
      .is("opened_at", null);

    assertNoSupabaseError(error, "Falha ao registrar abertura do convite");
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from(INVITATIONS_TABLE).delete().eq("id", id);
    assertNoSupabaseError(error, "Falha ao excluir convite");
  }
}
