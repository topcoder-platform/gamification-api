import { IsString, IsNotEmpty, IsUUID, IsUrl, IsOptional, IsNumberString, IsIn, IsBooleanString } from 'class-validator';

export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public organization_id: string;

  @IsString()
  @IsNotEmpty()
  public badge_status: string;

  @IsString()
  @IsNotEmpty()
  public badge_name: string;

  @IsString()
  public badge_description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  public badge_image_url: string;

  @IsString()
  public file_name: string;

  @IsOptional()
  @IsBooleanString()
  public active: boolean;
}

export class ValidOrgIdDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public organization_id: string;
}

export class ValidBadgeIdDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public badge_id: string;
}

export class GetBadgesQueryDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  public organization_id: string;

  @IsOptional()
  @IsNumberString()
  public limit: string;

  @IsOptional()
  @IsNumberString()
  public offset: string;

  @IsOptional()
  @IsString()
  @IsIn(['badge_name'])
  public order_by: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  public order_type: string;
}

export class AssignBadgeToMemberDto {
  @IsString()
  @IsUUID()
  public badge_id: string;

  @IsNumberString()
  public member_id: string;
}
export class VallidMemberIdDto {
  @IsNumberString()
  public member_id: string;
}

export class GetMemberBadgesQueryDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  public organization_id: string;

  @IsOptional()
  @IsString()
  public tags: string;

  @IsOptional()
  @IsString()
  @IsIn(['all', 'in', 'notIn', 'any'])
  public tags_query_type: string;

  @IsOptional()
  @IsNumberString()
  public limit: string;

  @IsOptional()
  @IsNumberString()
  public offset: string;

  @IsOptional()
  @IsString()
  @IsIn(['not_active', 'all'])
  public active_filter: string;
}
