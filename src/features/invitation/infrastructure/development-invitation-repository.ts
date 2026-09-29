import "server-only";
import {
  readDevelopmentCollection,
  updateDevelopmentCollection,
} from "@/infrastructure/development/development-collection-store";
import type {
  InvitationRecord,
  InvitationRepository,
  InvitationRsvpAnswer,
  NewInvitationRecord,
} from "../domain/invitation-record";

const COLLECTION_NAME = "invitations";

export class DevelopmentInvitationRepository implements InvitationRepository {
  async create(invitation: NewInvitationRecord): Promise<InvitationRecord> {
    const createdInvitation: InvitationRecord = {
      ...invitation,
      rsvpStatus: "pending",
      respondedAt: null,
      openedAt: null,
      createdAt: new Date().toISOString(),
    };
    await updateDevelopmentCollection<InvitationRecord>(COLLECTION_NAME, (invitations) => [
      createdInvitation,
      ...invitations,
    ]);
    return createdInvitation;
  }

  async listAll(): Promise<readonly InvitationRecord[]> {
    const invitations = await readDevelopmentCollection<InvitationRecord>(COLLECTION_NAME);
    return [...invitations].sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  }

  async findByToken(token: string): Promise<InvitationRecord | null> {
    const invitations = await readDevelopmentCollection<InvitationRecord>(COLLECTION_NAME);
    return invitations.find((invitation) => invitation.token === token) ?? null;
  }

  async findById(id: string): Promise<InvitationRecord | null> {
    const invitations = await readDevelopmentCollection<InvitationRecord>(COLLECTION_NAME);
    return invitations.find((invitation) => invitation.id === id) ?? null;
  }

  async updateRsvpStatus(id: string, status: InvitationRsvpAnswer, respondedAt: string): Promise<void> {
    await updateDevelopmentCollection<InvitationRecord>(COLLECTION_NAME, (invitations) =>
      invitations.map((invitation) =>
        invitation.id === id ? { ...invitation, rsvpStatus: status, respondedAt } : invitation,
      ),
    );
  }

  async markOpened(id: string, openedAt: string): Promise<void> {
    await updateDevelopmentCollection<InvitationRecord>(COLLECTION_NAME, (invitations) =>
      invitations.map((invitation) =>
        invitation.id === id && invitation.openedAt === null ? { ...invitation, openedAt } : invitation,
      ),
    );
  }

  async delete(id: string): Promise<void> {
    await updateDevelopmentCollection<InvitationRecord>(COLLECTION_NAME, (invitations) =>
      invitations.filter((invitation) => invitation.id !== id),
    );
  }
}
