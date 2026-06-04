import type { ApiResponse } from "../../types/common/ApiResponse";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";
import type { AuditDto } from "../../models/audits/AuditDto";

export interface IAuditAPIService {
  getAll(
    page?: number,
    limit?: number,
  ): Promise<ApiResponse<PaginatedListDto<AuditDto>>>;
}