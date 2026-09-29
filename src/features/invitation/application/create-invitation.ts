import type { GreetingPrefix, InvitationRecord, InvitationRepository } from "../domain/invitation-record";

export interface CreateInvitationRequest {
  readonly greetingPrefix: GreetingPrefix;
  readonly greetingName: string;
  readonly guestNames: readonly string[];
}

export interface CreateInvitationDependencies {
  readonly repository: InvitationRepository;
  readonly generateId: () => string;
  readonly generateToken: () => string;
}

export function createInvitation(
  request: CreateInvitationRequest,
  { repository, generateId, generateToken }: CreateInvitationDependencies,
): Promise<InvitationRecord> {
  return repository.create({
    id: generateId(),
    token: generateToken(),
    greetingPrefix: request.greetingPrefix,
    greetingName: request.greetingName,
    guestNames: request.guestNames,
  });
}
